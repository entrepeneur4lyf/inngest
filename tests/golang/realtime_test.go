package golang

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"os"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"github.com/inngest/inngest/pkg/execution/realtime"
	"github.com/inngest/inngest/pkg/execution/realtime/streamingtypes"
	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
	"github.com/inngest/inngestgo/streaming"
	"github.com/oklog/ulid/v2"
	"github.com/stretchr/testify/require"
)

func TestRealtime(t *testing.T) {
	ctx := context.Background()
	h, server, registerFuncs := NewSDKHandler(t, "realtime")
	defer server.Close()

	var (
		started, finished int32
		runID             string
		l                 sync.Mutex
	)

	fun := inngestgo.CreateFunction(
		inngestgo.FunctionOpts{Name: "realtime"},
		inngestgo.EventTrigger("test/realtime", nil),
		func(ctx context.Context, input inngestgo.Input[any]) (any, error) {
			runID = input.InputCtx.RunID
			atomic.AddInt32(&started, 1)

			_, _ = step.Run(ctx, "step-1", func(ctx context.Context) (string, error) {

				// Wait for the lock so that we respond on demand.
				l.Lock()
				defer l.Unlock()

				return "step 1 data", nil
			})

			defer atomic.AddInt32(&finished, 1)
			return map[string]any{"output": "fn result", "done": true}, nil
		},
	)
	h.Register(fun)
	registerFuncs()

	t.Run("It shows step results", func(t *testing.T) {

		// Lock the mutex so that the step doesn't finish until we let it.
		l.Lock()

		_, err := inngestgo.Send(ctx, inngestgo.Event{
			Name: "test/realtime",
			Data: map[string]any{"number": 10},
		})
		require.NoError(t, err)
		require.Eventually(t, func() bool { return atomic.LoadInt32(&started) > 0 }, 5*time.Second, 5*time.Millisecond)

		jwt, err := NewToken(t, realtime.Topic{
			Kind:    streamingtypes.TopicKindRun,
			Channel: ulid.MustParse(runID).String(),
			Name:    streamingtypes.TopicNameStep, // all step outputs
		})
		require.NoError(t, err)

		url := os.Getenv("API_URL") + "/v1/realtime/connect"
		stream, err := streaming.SubscribeWithURL(ctx, url, jwt)
		require.NoError(t, err)

		messages := []realtime.Message{}

		go func() {
			for msg := range stream {
				switch msg.Kind() {
				case streaming.StreamMessage:
					messages = append(messages, msg.Message())
				}
			}
		}()

		l.Unlock()

		require.Eventually(t, func() bool { return atomic.LoadInt32(&finished) == 1 }, 5*time.Second, 5*time.Millisecond)

		require.Equal(t, 1, len(messages))
		require.Equal(t, streamingtypes.MessageKindStep, messages[0].Kind)
		require.Equal(t, json.RawMessage(`"step 1 data"`), messages[0].Data)
		require.Equal(t, runID, messages[0].Channel)
	})

}

func NewToken(t *testing.T, topics ...realtime.Topic) (string, error) {
	resp, err := http.Post(os.Getenv("API_URL")+"/v1/realtime/token", "application/json", topicBuffer(topics))
	require.NoError(t, err)

	r := struct {
		JWT string `json:"jwt"`
	}{}
	err = json.NewDecoder(resp.Body).Decode(&r)
	require.NoError(t, err)

	return r.JWT, nil
}

func topicBuffer(topics []realtime.Topic) *bytes.Buffer {
	byt, _ := json.Marshal(topics)
	return bytes.NewBuffer(byt)
}
