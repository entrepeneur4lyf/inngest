// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package models

import (
	"fmt"
	"io"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/inngest/inngest/pkg/cqrs"
	"github.com/inngest/inngest/pkg/history_reader"
	ulid "github.com/oklog/ulid/v2"
)

type FunctionRunEvent interface {
	IsFunctionRunEvent()
}

type StepInfo interface {
	IsStepInfo()
}

type ActionVersionQuery struct {
	Dsn          string `json:"dsn"`
	VersionMajor *int   `json:"versionMajor,omitempty"`
	VersionMinor *int   `json:"versionMinor,omitempty"`
}

type CreateAppInput struct {
	URL string `json:"url"`
}

type Event struct {
	ID           ulid.ULID      `json:"id"`
	ExternalID   *string        `json:"externalID,omitempty"`
	Workspace    *Workspace     `json:"workspace,omitempty"`
	Name         *string        `json:"name,omitempty"`
	CreatedAt    *time.Time     `json:"createdAt,omitempty"`
	Payload      *string        `json:"payload,omitempty"`
	Schema       *string        `json:"schema,omitempty"`
	Status       *EventStatus   `json:"status,omitempty"`
	PendingRuns  *int           `json:"pendingRuns,omitempty"`
	TotalRuns    *int           `json:"totalRuns,omitempty"`
	Raw          *string        `json:"raw,omitempty"`
	FunctionRuns []*FunctionRun `json:"functionRuns,omitempty"`
}

type EventQuery struct {
	WorkspaceID string `json:"workspaceId"`
	EventID     string `json:"eventId"`
}

type EventsQuery struct {
	WorkspaceID string  `json:"workspaceId"`
	LastEventID *string `json:"lastEventId,omitempty"`
}

type Function struct {
	ID          string             `json:"id"`
	Name        string             `json:"name"`
	Slug        string             `json:"slug"`
	Config      string             `json:"config"`
	Concurrency int                `json:"concurrency"`
	Triggers    []*FunctionTrigger `json:"triggers,omitempty"`
	URL         string             `json:"url"`
	AppID       string             `json:"appID"`
	App         *cqrs.App          `json:"app"`
}

type FunctionEvent struct {
	Workspace   *Workspace         `json:"workspace,omitempty"`
	FunctionRun *FunctionRun       `json:"functionRun,omitempty"`
	Type        *FunctionEventType `json:"type,omitempty"`
	Output      *string            `json:"output,omitempty"`
	CreatedAt   *time.Time         `json:"createdAt,omitempty"`
}

func (FunctionEvent) IsFunctionRunEvent() {}

type FunctionRun struct {
	ID                string                       `json:"id"`
	FunctionID        string                       `json:"functionID"`
	Function          *Function                    `json:"function,omitempty"`
	Workspace         *Workspace                   `json:"workspace,omitempty"`
	Event             *Event                       `json:"event,omitempty"`
	Events            []*Event                     `json:"events"`
	BatchID           *ulid.ULID                   `json:"batchID,omitempty"`
	BatchCreatedAt    *time.Time                   `json:"batchCreatedAt,omitempty"`
	Status            *FunctionRunStatus           `json:"status,omitempty"`
	WaitingFor        *StepEventWait               `json:"waitingFor,omitempty"`
	PendingSteps      *int                         `json:"pendingSteps,omitempty"`
	StartedAt         *time.Time                   `json:"startedAt,omitempty"`
	FinishedAt        *time.Time                   `json:"finishedAt,omitempty"`
	Output            *string                      `json:"output,omitempty"`
	History           []*history_reader.RunHistory `json:"history"`
	HistoryItemOutput *string                      `json:"historyItemOutput,omitempty"`
	EventID           string                       `json:"eventID"`
	Cron              *string                      `json:"cron,omitempty"`
}

type FunctionRunQuery struct {
	WorkspaceID   string `json:"workspaceId"`
	FunctionRunID string `json:"functionRunId"`
}

type FunctionRunV2 struct {
	ID             ulid.ULID         `json:"id"`
	AppID          uuid.UUID         `json:"appID"`
	App            *cqrs.App         `json:"app"`
	FunctionID     uuid.UUID         `json:"functionID"`
	Function       *Function         `json:"function"`
	TraceID        string            `json:"traceID"`
	QueuedAt       time.Time         `json:"queuedAt"`
	StartedAt      *time.Time        `json:"startedAt,omitempty"`
	EndedAt        *time.Time        `json:"endedAt,omitempty"`
	Status         FunctionRunStatus `json:"status"`
	SourceID       *string           `json:"sourceID,omitempty"`
	TriggerIDs     []ulid.ULID       `json:"triggerIDs"`
	EventName      *string           `json:"eventName,omitempty"`
	IsBatch        bool              `json:"isBatch"`
	BatchCreatedAt *time.Time        `json:"batchCreatedAt,omitempty"`
	CronSchedule   *string           `json:"cronSchedule,omitempty"`
	Output         *string           `json:"output,omitempty"`
	Trace          *RunTraceSpan     `json:"trace,omitempty"`
}

type FunctionRunV2Edge struct {
	Node   *FunctionRunV2 `json:"node"`
	Cursor string         `json:"cursor"`
}

type FunctionRunsQuery struct {
	WorkspaceID string `json:"workspaceId"`
}

type FunctionTrigger struct {
	Type  FunctionTriggerTypes `json:"type"`
	Value string               `json:"value"`
}

type InvokeStepInfo struct {
	TriggeringEventID ulid.ULID  `json:"triggeringEventID"`
	FunctionID        string     `json:"functionID"`
	Timeout           time.Time  `json:"timeout"`
	ReturnEventID     *ulid.ULID `json:"returnEventID,omitempty"`
	RunID             *ulid.ULID `json:"runID,omitempty"`
	TimedOut          *bool      `json:"timedOut,omitempty"`
}

func (InvokeStepInfo) IsStepInfo() {}

// The pagination information in a connection.
type PageInfo struct {
	// Indicates if there are any pages subsequent to the current page.
	HasNextPage bool `json:"hasNextPage"`
	// Indicates if there are any pages prior to the current page.
	HasPreviousPage bool `json:"hasPreviousPage"`
	// When paginating backward, the cursor to query the previous page.
	StartCursor *string `json:"startCursor,omitempty"`
	// When paginating forward, the cursor to query the next page.
	EndCursor *string `json:"endCursor,omitempty"`
}

type RunTraceSpan struct {
	AppID         uuid.UUID          `json:"appID"`
	FunctionID    uuid.UUID          `json:"functionID"`
	RunID         ulid.ULID          `json:"runID"`
	Run           *FunctionRun       `json:"run"`
	SpanID        string             `json:"spanID"`
	TraceID       string             `json:"traceID"`
	Name          string             `json:"name"`
	Status        RunTraceSpanStatus `json:"status"`
	Attempts      *int               `json:"attempts,omitempty"`
	Duration      *int               `json:"duration,omitempty"`
	OutputID      *string            `json:"outputID,omitempty"`
	QueuedAt      time.Time          `json:"queuedAt"`
	StartedAt     *time.Time         `json:"startedAt,omitempty"`
	EndedAt       *time.Time         `json:"endedAt,omitempty"`
	ChildrenSpans []*RunTraceSpan    `json:"childrenSpans"`
	StepOp        *StepOp            `json:"stepOp,omitempty"`
	StepInfo      StepInfo           `json:"stepInfo,omitempty"`
	IsRoot        bool               `json:"isRoot"`
	ParentSpanID  *string            `json:"parentSpanID,omitempty"`
	ParentSpan    *RunTraceSpan      `json:"parentSpan,omitempty"`
}

type RunTraceSpanOutput struct {
	Data  *string    `json:"data,omitempty"`
	Error *StepError `json:"error,omitempty"`
}

type RunTraceTrigger struct {
	EventName *string     `json:"eventName,omitempty"`
	IDs       []ulid.ULID `json:"IDs"`
	Payloads  []string    `json:"payloads"`
	Timestamp time.Time   `json:"timestamp"`
	IsBatch   bool        `json:"isBatch"`
	BatchID   *ulid.ULID  `json:"batchID,omitempty"`
	Cron      *string     `json:"cron,omitempty"`
}

type RunsFilterV2 struct {
	From        time.Time           `json:"from"`
	Until       *time.Time          `json:"until,omitempty"`
	TimeField   *RunsV2OrderByField `json:"timeField,omitempty"`
	Status      []FunctionRunStatus `json:"status,omitempty"`
	FunctionIDs []uuid.UUID         `json:"functionIDs,omitempty"`
	AppIDs      []uuid.UUID         `json:"appIDs,omitempty"`
	Query       *string             `json:"query,omitempty"`
}

type RunsV2Connection struct {
	Edges      []*FunctionRunV2Edge `json:"edges"`
	PageInfo   *PageInfo            `json:"pageInfo"`
	TotalCount int                  `json:"totalCount"`
}

type RunsV2OrderBy struct {
	Field     RunsV2OrderByField   `json:"field"`
	Direction RunsOrderByDirection `json:"direction"`
}

type SleepStepInfo struct {
	SleepUntil time.Time `json:"sleepUntil"`
}

func (SleepStepInfo) IsStepInfo() {}

type StepError struct {
	Message string  `json:"message"`
	Name    *string `json:"name,omitempty"`
	Stack   *string `json:"stack,omitempty"`
}

type StepEvent struct {
	Workspace   *Workspace     `json:"workspace,omitempty"`
	FunctionRun *FunctionRun   `json:"functionRun,omitempty"`
	StepID      *string        `json:"stepID,omitempty"`
	Name        *string        `json:"name,omitempty"`
	Type        *StepEventType `json:"type,omitempty"`
	Output      *string        `json:"output,omitempty"`
	CreatedAt   *time.Time     `json:"createdAt,omitempty"`
	WaitingFor  *StepEventWait `json:"waitingFor,omitempty"`
}

func (StepEvent) IsFunctionRunEvent() {}

type StepEventWait struct {
	EventName  *string   `json:"eventName,omitempty"`
	Expression *string   `json:"expression,omitempty"`
	ExpiryTime time.Time `json:"expiryTime"`
}

type StreamItem struct {
	ID        string         `json:"id"`
	Trigger   string         `json:"trigger"`
	Type      StreamType     `json:"type"`
	CreatedAt time.Time      `json:"createdAt"`
	Runs      []*FunctionRun `json:"runs,omitempty"`
	InBatch   bool           `json:"inBatch"`
}

type StreamQuery struct {
	After                 *string `json:"after,omitempty"`
	Before                *string `json:"before,omitempty"`
	Limit                 int     `json:"limit"`
	IncludeInternalEvents *bool   `json:"includeInternalEvents,omitempty"`
}

type UpdateAppInput struct {
	ID  string `json:"id"`
	URL string `json:"url"`
}

type WaitForEventStepInfo struct {
	EventName    string     `json:"eventName"`
	Expression   *string    `json:"expression,omitempty"`
	Timeout      time.Time  `json:"timeout"`
	FoundEventID *ulid.ULID `json:"foundEventID,omitempty"`
	TimedOut     *bool      `json:"timedOut,omitempty"`
}

func (WaitForEventStepInfo) IsStepInfo() {}

type Workspace struct {
	ID string `json:"id"`
}

type EventStatus string

const (
	EventStatusRunning         EventStatus = "RUNNING"
	EventStatusCompleted       EventStatus = "COMPLETED"
	EventStatusPaused          EventStatus = "PAUSED"
	EventStatusFailed          EventStatus = "FAILED"
	EventStatusPartiallyFailed EventStatus = "PARTIALLY_FAILED"
	EventStatusNoFunctions     EventStatus = "NO_FUNCTIONS"
)

var AllEventStatus = []EventStatus{
	EventStatusRunning,
	EventStatusCompleted,
	EventStatusPaused,
	EventStatusFailed,
	EventStatusPartiallyFailed,
	EventStatusNoFunctions,
}

func (e EventStatus) IsValid() bool {
	switch e {
	case EventStatusRunning, EventStatusCompleted, EventStatusPaused, EventStatusFailed, EventStatusPartiallyFailed, EventStatusNoFunctions:
		return true
	}
	return false
}

func (e EventStatus) String() string {
	return string(e)
}

func (e *EventStatus) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = EventStatus(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid EventStatus", str)
	}
	return nil
}

func (e EventStatus) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type FunctionEventType string

const (
	FunctionEventTypeStarted   FunctionEventType = "STARTED"
	FunctionEventTypeCompleted FunctionEventType = "COMPLETED"
	FunctionEventTypeFailed    FunctionEventType = "FAILED"
	FunctionEventTypeCancelled FunctionEventType = "CANCELLED"
)

var AllFunctionEventType = []FunctionEventType{
	FunctionEventTypeStarted,
	FunctionEventTypeCompleted,
	FunctionEventTypeFailed,
	FunctionEventTypeCancelled,
}

func (e FunctionEventType) IsValid() bool {
	switch e {
	case FunctionEventTypeStarted, FunctionEventTypeCompleted, FunctionEventTypeFailed, FunctionEventTypeCancelled:
		return true
	}
	return false
}

func (e FunctionEventType) String() string {
	return string(e)
}

func (e *FunctionEventType) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = FunctionEventType(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid FunctionEventType", str)
	}
	return nil
}

func (e FunctionEventType) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type FunctionRunStatus string

const (
	FunctionRunStatusCompleted FunctionRunStatus = "COMPLETED"
	FunctionRunStatusFailed    FunctionRunStatus = "FAILED"
	FunctionRunStatusCancelled FunctionRunStatus = "CANCELLED"
	FunctionRunStatusRunning   FunctionRunStatus = "RUNNING"
	FunctionRunStatusQueued    FunctionRunStatus = "QUEUED"
)

var AllFunctionRunStatus = []FunctionRunStatus{
	FunctionRunStatusCompleted,
	FunctionRunStatusFailed,
	FunctionRunStatusCancelled,
	FunctionRunStatusRunning,
	FunctionRunStatusQueued,
}

func (e FunctionRunStatus) IsValid() bool {
	switch e {
	case FunctionRunStatusCompleted, FunctionRunStatusFailed, FunctionRunStatusCancelled, FunctionRunStatusRunning, FunctionRunStatusQueued:
		return true
	}
	return false
}

func (e FunctionRunStatus) String() string {
	return string(e)
}

func (e *FunctionRunStatus) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = FunctionRunStatus(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid FunctionRunStatus", str)
	}
	return nil
}

func (e FunctionRunStatus) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type FunctionStatus string

const (
	FunctionStatusRunning   FunctionStatus = "RUNNING"
	FunctionStatusCompleted FunctionStatus = "COMPLETED"
	FunctionStatusFailed    FunctionStatus = "FAILED"
	FunctionStatusCancelled FunctionStatus = "CANCELLED"
)

var AllFunctionStatus = []FunctionStatus{
	FunctionStatusRunning,
	FunctionStatusCompleted,
	FunctionStatusFailed,
	FunctionStatusCancelled,
}

func (e FunctionStatus) IsValid() bool {
	switch e {
	case FunctionStatusRunning, FunctionStatusCompleted, FunctionStatusFailed, FunctionStatusCancelled:
		return true
	}
	return false
}

func (e FunctionStatus) String() string {
	return string(e)
}

func (e *FunctionStatus) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = FunctionStatus(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid FunctionStatus", str)
	}
	return nil
}

func (e FunctionStatus) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type FunctionTriggerTypes string

const (
	FunctionTriggerTypesEvent FunctionTriggerTypes = "EVENT"
	FunctionTriggerTypesCron  FunctionTriggerTypes = "CRON"
)

var AllFunctionTriggerTypes = []FunctionTriggerTypes{
	FunctionTriggerTypesEvent,
	FunctionTriggerTypesCron,
}

func (e FunctionTriggerTypes) IsValid() bool {
	switch e {
	case FunctionTriggerTypesEvent, FunctionTriggerTypesCron:
		return true
	}
	return false
}

func (e FunctionTriggerTypes) String() string {
	return string(e)
}

func (e *FunctionTriggerTypes) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = FunctionTriggerTypes(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid FunctionTriggerTypes", str)
	}
	return nil
}

func (e FunctionTriggerTypes) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type RunTraceSpanStatus string

const (
	RunTraceSpanStatusFailed    RunTraceSpanStatus = "FAILED"
	RunTraceSpanStatusQueued    RunTraceSpanStatus = "QUEUED"
	RunTraceSpanStatusRunning   RunTraceSpanStatus = "RUNNING"
	RunTraceSpanStatusCompleted RunTraceSpanStatus = "COMPLETED"
	RunTraceSpanStatusWaiting   RunTraceSpanStatus = "WAITING"
	RunTraceSpanStatusCancelled RunTraceSpanStatus = "CANCELLED"
)

var AllRunTraceSpanStatus = []RunTraceSpanStatus{
	RunTraceSpanStatusFailed,
	RunTraceSpanStatusQueued,
	RunTraceSpanStatusRunning,
	RunTraceSpanStatusCompleted,
	RunTraceSpanStatusWaiting,
	RunTraceSpanStatusCancelled,
}

func (e RunTraceSpanStatus) IsValid() bool {
	switch e {
	case RunTraceSpanStatusFailed, RunTraceSpanStatusQueued, RunTraceSpanStatusRunning, RunTraceSpanStatusCompleted, RunTraceSpanStatusWaiting, RunTraceSpanStatusCancelled:
		return true
	}
	return false
}

func (e RunTraceSpanStatus) String() string {
	return string(e)
}

func (e *RunTraceSpanStatus) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = RunTraceSpanStatus(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid RunTraceSpanStatus", str)
	}
	return nil
}

func (e RunTraceSpanStatus) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type RunsOrderByDirection string

const (
	RunsOrderByDirectionAsc  RunsOrderByDirection = "ASC"
	RunsOrderByDirectionDesc RunsOrderByDirection = "DESC"
)

var AllRunsOrderByDirection = []RunsOrderByDirection{
	RunsOrderByDirectionAsc,
	RunsOrderByDirectionDesc,
}

func (e RunsOrderByDirection) IsValid() bool {
	switch e {
	case RunsOrderByDirectionAsc, RunsOrderByDirectionDesc:
		return true
	}
	return false
}

func (e RunsOrderByDirection) String() string {
	return string(e)
}

func (e *RunsOrderByDirection) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = RunsOrderByDirection(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid RunsOrderByDirection", str)
	}
	return nil
}

func (e RunsOrderByDirection) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type RunsV2OrderByField string

const (
	RunsV2OrderByFieldQueuedAt  RunsV2OrderByField = "QUEUED_AT"
	RunsV2OrderByFieldStartedAt RunsV2OrderByField = "STARTED_AT"
	RunsV2OrderByFieldEndedAt   RunsV2OrderByField = "ENDED_AT"
)

var AllRunsV2OrderByField = []RunsV2OrderByField{
	RunsV2OrderByFieldQueuedAt,
	RunsV2OrderByFieldStartedAt,
	RunsV2OrderByFieldEndedAt,
}

func (e RunsV2OrderByField) IsValid() bool {
	switch e {
	case RunsV2OrderByFieldQueuedAt, RunsV2OrderByFieldStartedAt, RunsV2OrderByFieldEndedAt:
		return true
	}
	return false
}

func (e RunsV2OrderByField) String() string {
	return string(e)
}

func (e *RunsV2OrderByField) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = RunsV2OrderByField(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid RunsV2OrderByField", str)
	}
	return nil
}

func (e RunsV2OrderByField) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type StepEventType string

const (
	StepEventTypeScheduled StepEventType = "SCHEDULED"
	StepEventTypeStarted   StepEventType = "STARTED"
	StepEventTypeCompleted StepEventType = "COMPLETED"
	StepEventTypeErrored   StepEventType = "ERRORED"
	StepEventTypeFailed    StepEventType = "FAILED"
	StepEventTypeWaiting   StepEventType = "WAITING"
)

var AllStepEventType = []StepEventType{
	StepEventTypeScheduled,
	StepEventTypeStarted,
	StepEventTypeCompleted,
	StepEventTypeErrored,
	StepEventTypeFailed,
	StepEventTypeWaiting,
}

func (e StepEventType) IsValid() bool {
	switch e {
	case StepEventTypeScheduled, StepEventTypeStarted, StepEventTypeCompleted, StepEventTypeErrored, StepEventTypeFailed, StepEventTypeWaiting:
		return true
	}
	return false
}

func (e StepEventType) String() string {
	return string(e)
}

func (e *StepEventType) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = StepEventType(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid StepEventType", str)
	}
	return nil
}

func (e StepEventType) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type StepOp string

const (
	StepOpInvoke       StepOp = "INVOKE"
	StepOpRun          StepOp = "RUN"
	StepOpSleep        StepOp = "SLEEP"
	StepOpWaitForEvent StepOp = "WAIT_FOR_EVENT"
)

var AllStepOp = []StepOp{
	StepOpInvoke,
	StepOpRun,
	StepOpSleep,
	StepOpWaitForEvent,
}

func (e StepOp) IsValid() bool {
	switch e {
	case StepOpInvoke, StepOpRun, StepOpSleep, StepOpWaitForEvent:
		return true
	}
	return false
}

func (e StepOp) String() string {
	return string(e)
}

func (e *StepOp) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = StepOp(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid StepOp", str)
	}
	return nil
}

func (e StepOp) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type StreamType string

const (
	StreamTypeEvent StreamType = "EVENT"
	StreamTypeCron  StreamType = "CRON"
)

var AllStreamType = []StreamType{
	StreamTypeEvent,
	StreamTypeCron,
}

func (e StreamType) IsValid() bool {
	switch e {
	case StreamTypeEvent, StreamTypeCron:
		return true
	}
	return false
}

func (e StreamType) String() string {
	return string(e)
}

func (e *StreamType) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = StreamType(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid StreamType", str)
	}
	return nil
}

func (e StreamType) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}
