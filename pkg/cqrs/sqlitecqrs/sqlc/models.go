// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0

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
	DeletedAt   sql.NullTime
	Url         string
}

type Event struct {
	InternalID  ulid.ULID
	AccountID   interface{}
	WorkspaceID interface{}
	Source      sql.NullString
	SourceID    interface{}
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
	ID        uuid.UUID
	AppID     uuid.UUID
	Name      string
	Slug      string
	Config    string
	CreatedAt time.Time
}

type FunctionFinish struct {
	RunID              ulid.ULID
	Status             sql.NullString
	Output             sql.NullString
	CompletedStepCount sql.NullInt64
	CreatedAt          sql.NullTime
}

type FunctionRun struct {
	RunID           ulid.ULID
	RunStartedAt    time.Time
	FunctionID      uuid.UUID
	FunctionVersion int64
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
	FunctionVersion      int64
	RunID                ulid.ULID
	EventID              ulid.ULID
	BatchID              ulid.ULID
	GroupID              sql.NullString
	IdempotencyKey       string
	Type                 string
	Attempt              int64
	LatencyMs            sql.NullInt64
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
}

type QueueSnapshotChunk struct {
	SnapshotID int64
	ChunkID    int64
	Data       []byte
}

type QueueSnapshotVersion struct {
	SnapshotID int64
	CreatedAt  time.Time
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
	Duration           int64
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
	Status       int64
	SourceID     string
	TriggerIds   []byte
	Output       []byte
	IsDebounce   bool
	BatchID      ulid.ULID
	CronSchedule sql.NullString
}
