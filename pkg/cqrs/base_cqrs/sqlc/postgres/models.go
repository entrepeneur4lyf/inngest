// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.28.0

package sqlc

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
	ulid "github.com/oklog/ulid/v2"
)

type App struct {
	ID          uuid.UUID
	Name        string
	SdkLanguage string
	SdkVersion  string
	Framework   sql.NullString
	Metadata    string
	Status      string
	Error       sql.NullString
	Checksum    string
	CreatedAt   time.Time
	ArchivedAt  sql.NullTime
	Url         string
	Method      string
	AppVersion  sql.NullString
}

type Event struct {
	InternalID  ulid.ULID
	AccountID   sql.NullString
	WorkspaceID sql.NullString
	Source      sql.NullString
	SourceID    sql.NullString
	ReceivedAt  time.Time
	EventID     string
	EventName   string
	EventData   string
	EventUser   string
	EventV      sql.NullString
	EventTs     time.Time
}

type EventBatch struct {
	ID          ulid.ULID
	AccountID   uuid.UUID
	WorkspaceID uuid.UUID
	AppID       uuid.UUID
	WorkflowID  uuid.UUID
	RunID       ulid.ULID
	StartedAt   time.Time
	ExecutedAt  time.Time
	EventIds    []byte
}

type Function struct {
	ID         uuid.UUID
	AppID      uuid.UUID
	Name       string
	Slug       string
	Config     string
	CreatedAt  time.Time
	ArchivedAt sql.NullTime
}

type FunctionFinish struct {
	RunID              ulid.ULID
	Status             string
	Output             string
	CompletedStepCount int32
	CreatedAt          time.Time
}

type FunctionRun struct {
	RunID           ulid.ULID
	RunStartedAt    time.Time
	FunctionID      uuid.UUID
	FunctionVersion int32
	TriggerType     string
	EventID         ulid.ULID
	BatchID         ulid.ULID
	OriginalRunID   ulid.ULID
	Cron            sql.NullString
}

type History struct {
	ID                   ulid.ULID
	CreatedAt            time.Time
	RunStartedAt         time.Time
	FunctionID           uuid.UUID
	FunctionVersion      int32
	RunID                ulid.ULID
	EventID              ulid.ULID
	BatchID              ulid.ULID
	GroupID              sql.NullString
	IdempotencyKey       string
	Type                 string
	Attempt              int32
	LatencyMs            sql.NullInt32
	StepName             sql.NullString
	StepID               sql.NullString
	Url                  sql.NullString
	CancelRequest        sql.NullString
	Sleep                sql.NullString
	WaitForEvent         sql.NullString
	WaitResult           sql.NullString
	InvokeFunction       sql.NullString
	InvokeFunctionResult sql.NullString
	Result               sql.NullString
	StepType             sql.NullString
}

type QueueSnapshotChunk struct {
	SnapshotID string
	ChunkID    int32
	Data       []byte
}

type Trace struct {
	Timestamp          time.Time
	TimestampUnixMs    int64
	TraceID            string
	SpanID             string
	ParentSpanID       sql.NullString
	TraceState         sql.NullString
	SpanName           string
	SpanKind           string
	ServiceName        string
	ResourceAttributes []byte
	ScopeName          string
	ScopeVersion       string
	SpanAttributes     []byte
	Duration           int32
	StatusCode         string
	StatusMessage      sql.NullString
	Events             []byte
	Links              []byte
	RunID              ulid.ULID
}

type TraceRun struct {
	RunID        ulid.ULID
	AccountID    uuid.UUID
	WorkspaceID  uuid.UUID
	AppID        uuid.UUID
	FunctionID   uuid.UUID
	TraceID      []byte
	QueuedAt     int64
	StartedAt    int64
	EndedAt      int64
	Status       int32
	SourceID     string
	TriggerIds   []byte
	Output       []byte
	IsDebounce   bool
	BatchID      ulid.ULID
	CronSchedule sql.NullString
	HasAi        bool
}

type WorkerConnection struct {
	AccountID        uuid.UUID
	WorkspaceID      uuid.UUID
	AppID            *uuid.UUID
	ID               ulid.ULID
	GatewayID        ulid.ULID
	InstanceID       string
	Status           int16
	WorkerIp         string
	ConnectedAt      int64
	LastHeartbeatAt  sql.NullInt64
	DisconnectedAt   sql.NullInt64
	RecordedAt       int64
	InsertedAt       int64
	DisconnectReason sql.NullString
	GroupHash        []byte
	SdkLang          string
	SdkVersion       string
	SdkPlatform      string
	SyncID           *uuid.UUID
	AppVersion       sql.NullString
	FunctionCount    int32
	CpuCores         int32
	MemBytes         int64
	Os               string
}
