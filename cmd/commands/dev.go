package commands

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/inngest/inngest/cmd/commands/internal/localconfig"
	"github.com/inngest/inngest/pkg/config"
	"github.com/inngest/inngest/pkg/devserver"
	"github.com/inngest/inngest/pkg/headers"
	itrace "github.com/inngest/inngest/pkg/telemetry/trace"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

func NewCmdDev() *cobra.Command {
	cmd := &cobra.Command{
		Use:     "dev",
		Short:   "Run the Inngest Dev Server for local development.",
		Example: "inngest dev -u http://localhost:3000/api/inngest",
		Run:     doDev,
	}

	cmd.Flags().String("config", "", "Path to an Inngest configuration file")
	cmd.Flags().BoolP("help", "h", false, "Output this help information")
	cmd.Flags().String("host", "", "host to run the API on")
	cmd.Flags().StringP("port", "p", "8288", "port to run the API on")
	cmd.Flags().StringSliceP("sdk-url", "u", []string{}, "SDK URLs to load functions from")
	cmd.Flags().Bool("no-discovery", false, "Disable app auto-discovery")
	cmd.Flags().Bool("no-poll", false, "Disable polling of apps for updates")
	cmd.Flags().Int("poll-interval", devserver.DefaultPollInterval, "Interval in seconds between polling for updates to apps")
	cmd.Flags().Int("retry-interval", 0, "Retry interval in seconds for linear backoff when retrying functions - must be 1 or above")
	cmd.Flags().Int("queue-workers", devserver.DefaultQueueWorkers, "Number of workers to execute steps in the queue")
	cmd.Flags().Int("tick", 150, "The interval (in milliseconds) at which the executor checks for new work, during local development")

	return cmd
}

func doDev(cmd *cobra.Command, args []string) {

	go func() {
		ctx, cleanup := signal.NotifyContext(
			context.Background(),
			os.Interrupt,
			syscall.SIGTERM,
			syscall.SIGINT,
			syscall.SIGQUIT,
		)
		defer cleanup()
		<-ctx.Done()
		os.Exit(0)
	}()

	ctx := cmd.Context()
	conf, err := config.Dev(ctx)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	if err = localconfig.InitDevConfig(ctx, cmd); err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	port, err := strconv.Atoi(viper.GetString("port"))
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}
	conf.EventAPI.Port = port

	host := viper.GetString("host")
	if host != "" {
		conf.EventAPI.Addr = host
	}

	urls := viper.GetStringSlice("sdk-url")

	// Run auto-discovery unless we've explicitly disabled it.
	noDiscovery := viper.GetBool("no-discovery")
	noPoll := viper.GetBool("no-poll")
	pollInterval := viper.GetInt("poll-interval")
	retryInterval := viper.GetInt("retry-interval")
	queueWorkers := viper.GetInt("queue-workers")
	tick := viper.GetInt("tick")

	if err := itrace.NewUserTracer(ctx, itrace.TracerOpts{
		ServiceName:   "tracing",
		TraceEndpoint: "localhost:8288",
		TraceURLPath:  "/dev/traces",
		Type:          itrace.TracerTypeOTLPHTTP,
	}); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	defer func() {
		_ = itrace.CloseUserTracer(ctx)
	}()

	conf.ServerKind = headers.ServerKindDev

	opts := devserver.StartOpts{
		Autodiscover:  !noDiscovery,
		Config:        *conf,
		Poll:          !noPoll,
		PollInterval:  pollInterval,
		RetryInterval: retryInterval,
		QueueWorkers:  queueWorkers,
		Tick:          time.Duration(tick) * time.Millisecond,
		URLs:          urls,
	}

	err = devserver.New(ctx, opts)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
