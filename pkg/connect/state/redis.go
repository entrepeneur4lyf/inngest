package state

import (
	"context"
	"embed"
	"encoding/json"
	"fmt"
	"io/fs"
	"log/slog"
	"regexp"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/inngest/inngest/pkg/logger"
	connpb "github.com/inngest/inngest/proto/gen/connect/v1"
	"github.com/redis/rueidis"
)

//go:embed lua/*
var embedded embed.FS

var (
	scripts = map[string]*rueidis.Lua{}
	include = regexp.MustCompile(`-- \$include\(([\w.]+)\)`)
)

func init() {
	entries, err := embedded.ReadDir("lua")
	if err != nil {
		panic(fmt.Errorf("error reading redis lua dir: %w", err))
	}
	readRedisScripts("lua", entries)
}

func readRedisScripts(path string, entries []fs.DirEntry) {
	for _, e := range entries {
		// NOTE: When using embed go always uses forward slashes as a path
		// prefix. filepath.Join uses OS-specific prefixes which fails on
		// windows, so we construct the path using Sprintf for all platforms
		if e.IsDir() {
			entries, _ := embedded.ReadDir(fmt.Sprintf("%s/%s", path, e.Name()))
			readRedisScripts(path+"/"+e.Name(), entries)
			continue
		}

		byt, err := embedded.ReadFile(fmt.Sprintf("%s/%s", path, e.Name()))
		if err != nil {
			panic(fmt.Errorf("error reading redis lua script: %w", err))
		}

		name := path + "/" + e.Name()
		name = strings.TrimPrefix(name, "lua/")
		name = strings.TrimSuffix(name, ".lua")
		val := string(byt)

		// Add any includes.
		items := include.FindAllStringSubmatch(val, -1)
		if len(items) > 0 {
			// Replace each include
			for _, include := range items {
				byt, err = embedded.ReadFile(fmt.Sprintf("lua/includes/%s", include[1]))
				if err != nil {
					panic(fmt.Errorf("error reading redis lua include: %w", err))
				}
				val = strings.ReplaceAll(val, include[0], string(byt))
			}
		}

		scripts[name] = rueidis.NewLuaScript(val)
	}
}

type redisConnectionStateManager struct {
	client rueidis.Client
	logger *slog.Logger
}

func NewRedisConnectionStateManager(client rueidis.Client) *redisConnectionStateManager {
	return &redisConnectionStateManager{
		client: client,
		logger: logger.StdlibLogger(context.Background()),
	}
}

func (r redisConnectionStateManager) SetRequestIdempotency(ctx context.Context, appId uuid.UUID, requestId string) error {
	idempotencyKey := fmt.Sprintf("{%s}:idempotency:%s", appId, requestId)
	res := r.client.Do(
		ctx,
		r.client.B().Set().Key(idempotencyKey).Value("1").Nx().Ex(time.Second*10).Build(),
	)
	set, err := res.AsBool()
	if (err == nil || rueidis.IsRedisNil(err)) && !set {
		return ErrIdempotencyKeyExists
	}
	if err != nil {
		return fmt.Errorf("could not set idempotency key: %w", err)
	}

	return nil
}

func (r *redisConnectionStateManager) GetConnectionsByEnvID(ctx context.Context, wsID uuid.UUID) ([]*connpb.ConnMetadata, error) {
	key := r.connKey(wsID.String())
	cmd := r.client.B().Hvals().Key(key).Build()

	res, err := r.client.Do(ctx, cmd).AsStrSlice()
	if err != nil {
		return nil, err
	}

	conns := []*connpb.ConnMetadata{}
	for _, meta := range res {
		var conn connpb.ConnMetadata
		if err := json.Unmarshal([]byte(meta), &conn); err != nil {
			return nil, err
		}
		conns = append(conns, &conn)
	}

	return conns, nil
}

func (r *redisConnectionStateManager) GetConnectionsByAppID(ctx context.Context, appID uuid.UUID) ([]*connpb.ConnMetadata, error) {
	return nil, notImplementedError
}

func (r *redisConnectionStateManager) AddConnection(ctx context.Context, data *connpb.SDKConnectRequestData) error {
	envID := data.AuthData.GetEnvId()

	// groupID := data.SessionDetails.FunctionHash
	groupID := "something"
	groupKey := fmt.Sprintf("{%s}:groups:%s", envID, groupID)

	meta := &connpb.ConnMetadata{
		Language: data.SdkLanguage,
		Version:  data.SdkVersion,
		EnvId:    envID,
		Session:  data.SessionDetails,
	}

	byt, err := json.Marshal(meta)
	if err != nil {
		return err
	}

	keys := []string{
		r.connKey(envID),
		groupKey,
	}
	args := []string{
		data.SessionDetails.ConnectionId,
		string(byt),
	}
	if err != nil {
		return err
	}

	status, err := scripts["add_conn"].Exec(
		ctx,
		r.client,
		keys,
		args,
	).AsInt64()
	if err != nil {
		return err
	}

	switch status {
	case 0:
		return nil

	default:
		return fmt.Errorf("unknown status when storing connection metadata: %d", status)
	}
}

func (r *redisConnectionStateManager) DeleteConnection(ctx context.Context, connID string) error {
	return notImplementedError
}

func (r *redisConnectionStateManager) connKey(envID string) string {
	return fmt.Sprintf("{%s}:conns", envID)
}
