package models

import (
	"context"
	"fmt"

	"github.com/inngest/inngest/pkg/cqrs"
	"github.com/inngest/inngest/pkg/enums"
	"github.com/inngest/inngest/pkg/logger"
)

func MakeFunction(f *cqrs.Function) (*Function, error) {
	fn, err := f.InngestFunction()
	if err != nil {
		return nil, err
	}

	triggers := make([]*FunctionTrigger, len(fn.Triggers))
	for n, t := range fn.Triggers {
		var (
			val string
			typ FunctionTriggerTypes
		)
		if t.CronTrigger != nil {
			typ = FunctionTriggerTypesCron
			val = t.Cron
		}
		if t.EventTrigger != nil {
			typ = FunctionTriggerTypesEvent
			val = t.Event
		}
		triggers[n] = &FunctionTrigger{
			Type:  typ,
			Value: val,
		}
	}

	concurrency := 0
	if fn.Concurrency != nil {
		concurrency = fn.Concurrency.PartitionConcurrency()
	}

	return &Function{
		AppID:       f.AppID.String(),
		ID:          f.ID.String(),
		Name:        f.Name,
		Slug:        f.Slug,
		Config:      string(f.Config),
		Concurrency: concurrency,
		Triggers:    triggers,
		URL:         fn.Steps[0].URI,
	}, nil
}

func MakeFunctionRun(f *cqrs.FunctionRun) *FunctionRun {
	status, err := ToFunctionRunStatus(f.Status)
	if err != nil {
		logger.StdlibLogger(context.Background()).
			Error(
				"unknown run status",
				"error", err,
				"status", f.Status.String(),
			)
	}

	// TODO: Map GQL types to CQRS types and remove this.
	r := &FunctionRun{
		ID:         f.RunID.String(),
		FunctionID: f.FunctionID.String(),
		FinishedAt: f.EndedAt,
		StartedAt:  &f.RunStartedAt,
		EventID:    f.EventID.String(),
		BatchID:    f.BatchID,
		Status:     &status,
		Cron:       f.Cron,
	}
	if len(f.Output) > 0 {
		str := string(f.Output)
		r.Output = &str
	}
	return r
}

func ToFunctionRunStatus(s enums.RunStatus) (FunctionRunStatus, error) {
	switch s {
	case enums.RunStatusScheduled:
		return FunctionRunStatusQueued, nil
	case enums.RunStatusRunning:
		return FunctionRunStatusRunning, nil
	case enums.RunStatusCompleted:
		return FunctionRunStatusCompleted, nil
	case enums.RunStatusFailed:
		return FunctionRunStatusFailed, nil
	case enums.RunStatusCancelled:
		return FunctionRunStatusCancelled, nil
	default:
		return FunctionRunStatusRunning, fmt.Errorf("unknown run status: %d", s)
	}
}

func FromAppConnectionType(connectionType AppConnectionType) (enums.AppConnectionType, error) {
	switch connectionType {
	case AppConnectionTypeConnect:
		return enums.AppConnectionTypeConnect, nil
	case AppConnectionTypeServerless:
		return enums.AppConnectionTypeServerless, nil
	default:
		return enums.AppConnectionType(0), fmt.Errorf("unknown connection type: %s", connectionType.String())
	}
}

func FromAppsFilter(in *AppsFilterV1) (*cqrs.FilterAppParam, error) {
	if in == nil {
		return nil, nil
	}

	filter := &cqrs.FilterAppParam{}
	if in.ConnectionType != nil {
		connType, err := FromAppConnectionType(*in.ConnectionType)
		if err != nil {
			return nil, err
		}
		filter.ConnectionType = &connType
	}

	return filter, nil
}

func ToAppConnectionType(connectionType enums.AppConnectionType) AppConnectionType {
	switch connectionType {
	case enums.AppConnectionTypeServerless:
		return AppConnectionTypeServerless
	case enums.AppConnectionTypeConnect:
		return AppConnectionTypeConnect
	default:
		return AppConnectionTypeServerless
	}
}
