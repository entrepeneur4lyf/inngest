// Code generated by protoc-gen-connect-go. DO NOT EDIT.
//
// Source: state/v2/state.proto

package statev2connect

import (
	connect "connectrpc.com/connect"
	context "context"
	errors "errors"
	v2 "github.com/inngest/inngest/proto/gen/state/v2"
	http "net/http"
	strings "strings"
)

// This is a compile-time assertion to ensure that this generated file and the connect package are
// compatible. If you get a compiler error that this constant is not defined, this code was
// generated with a version of connect newer than the one compiled into your binary. You can fix the
// problem by either regenerating this code with an older version of connect or updating the connect
// version compiled into your binary.
const _ = connect.IsAtLeastVersion1_13_0

const (
	// RunServiceName is the fully-qualified name of the RunService service.
	RunServiceName = "state.v2.RunService"
)

// These constants are the fully-qualified names of the RPCs defined in this package. They're
// exposed at runtime as Spec.Procedure and as the final two segments of the HTTP route.
//
// Note that these are different from the fully-qualified method names used by
// google.golang.org/protobuf/reflect/protoreflect. To convert from these constants to
// reflection-formatted method names, remove the leading slash and convert the remaining slash to a
// period.
const (
	// RunServiceCreateProcedure is the fully-qualified name of the RunService's Create RPC.
	RunServiceCreateProcedure = "/state.v2.RunService/Create"
	// RunServiceDeleteProcedure is the fully-qualified name of the RunService's Delete RPC.
	RunServiceDeleteProcedure = "/state.v2.RunService/Delete"
	// RunServiceExistsProcedure is the fully-qualified name of the RunService's Exists RPC.
	RunServiceExistsProcedure = "/state.v2.RunService/Exists"
	// RunServiceUpdateMetadataProcedure is the fully-qualified name of the RunService's UpdateMetadata
	// RPC.
	RunServiceUpdateMetadataProcedure = "/state.v2.RunService/UpdateMetadata"
	// RunServiceSaveStepProcedure is the fully-qualified name of the RunService's SaveStep RPC.
	RunServiceSaveStepProcedure = "/state.v2.RunService/SaveStep"
	// RunServiceLoadMetadataProcedure is the fully-qualified name of the RunService's LoadMetadata RPC.
	RunServiceLoadMetadataProcedure = "/state.v2.RunService/LoadMetadata"
	// RunServiceLoadEventsProcedure is the fully-qualified name of the RunService's LoadEvents RPC.
	RunServiceLoadEventsProcedure = "/state.v2.RunService/LoadEvents"
	// RunServiceLoadStepsProcedure is the fully-qualified name of the RunService's LoadSteps RPC.
	RunServiceLoadStepsProcedure = "/state.v2.RunService/LoadSteps"
	// RunServiceLoadKVProcedure is the fully-qualified name of the RunService's LoadKV RPC.
	RunServiceLoadKVProcedure = "/state.v2.RunService/LoadKV"
	// RunServiceLoadStateProcedure is the fully-qualified name of the RunService's LoadState RPC.
	RunServiceLoadStateProcedure = "/state.v2.RunService/LoadState"
)

// These variables are the protoreflect.Descriptor objects for the RPCs defined in this package.
var (
	runServiceServiceDescriptor              = v2.File_state_v2_state_proto.Services().ByName("RunService")
	runServiceCreateMethodDescriptor         = runServiceServiceDescriptor.Methods().ByName("Create")
	runServiceDeleteMethodDescriptor         = runServiceServiceDescriptor.Methods().ByName("Delete")
	runServiceExistsMethodDescriptor         = runServiceServiceDescriptor.Methods().ByName("Exists")
	runServiceUpdateMetadataMethodDescriptor = runServiceServiceDescriptor.Methods().ByName("UpdateMetadata")
	runServiceSaveStepMethodDescriptor       = runServiceServiceDescriptor.Methods().ByName("SaveStep")
	runServiceLoadMetadataMethodDescriptor   = runServiceServiceDescriptor.Methods().ByName("LoadMetadata")
	runServiceLoadEventsMethodDescriptor     = runServiceServiceDescriptor.Methods().ByName("LoadEvents")
	runServiceLoadStepsMethodDescriptor      = runServiceServiceDescriptor.Methods().ByName("LoadSteps")
	runServiceLoadKVMethodDescriptor         = runServiceServiceDescriptor.Methods().ByName("LoadKV")
	runServiceLoadStateMethodDescriptor      = runServiceServiceDescriptor.Methods().ByName("LoadState")
)

// RunServiceClient is a client for the state.v2.RunService service.
type RunServiceClient interface {
	Create(context.Context, *connect.Request[v2.CreateStateRequest]) (*connect.Response[v2.CreateStateResponse], error)
	Delete(context.Context, *connect.Request[v2.DeleteStateRequest]) (*connect.Response[v2.DeleteStateResponse], error)
	Exists(context.Context, *connect.Request[v2.ExistsRequest]) (*connect.Response[v2.ExistsResponse], error)
	UpdateMetadata(context.Context, *connect.Request[v2.UpdateMetadataRequest]) (*connect.Response[v2.UpdateMetadataResponse], error)
	SaveStep(context.Context, *connect.Request[v2.SaveStepRequest]) (*connect.Response[v2.SaveStepResponse], error)
	LoadMetadata(context.Context, *connect.Request[v2.LoadMetadataRequest]) (*connect.Response[v2.LoadMetadataResponse], error)
	LoadEvents(context.Context, *connect.Request[v2.LoadEventsRequest]) (*connect.Response[v2.LoadEventsResponse], error)
	LoadSteps(context.Context, *connect.Request[v2.LoadStepsRequest]) (*connect.Response[v2.LoadStepsResponse], error)
	LoadKV(context.Context, *connect.Request[v2.LoadKVRequest]) (*connect.Response[v2.LoadKVResponse], error)
	LoadState(context.Context, *connect.Request[v2.LoadStateRequest]) (*connect.Response[v2.LoadStateResponse], error)
}

// NewRunServiceClient constructs a client for the state.v2.RunService service. By default, it uses
// the Connect protocol with the binary Protobuf Codec, asks for gzipped responses, and sends
// uncompressed requests. To use the gRPC or gRPC-Web protocols, supply the connect.WithGRPC() or
// connect.WithGRPCWeb() options.
//
// The URL supplied here should be the base URL for the Connect or gRPC server (for example,
// http://api.acme.com or https://acme.com/grpc).
func NewRunServiceClient(httpClient connect.HTTPClient, baseURL string, opts ...connect.ClientOption) RunServiceClient {
	baseURL = strings.TrimRight(baseURL, "/")
	return &runServiceClient{
		create: connect.NewClient[v2.CreateStateRequest, v2.CreateStateResponse](
			httpClient,
			baseURL+RunServiceCreateProcedure,
			connect.WithSchema(runServiceCreateMethodDescriptor),
			connect.WithClientOptions(opts...),
		),
		delete: connect.NewClient[v2.DeleteStateRequest, v2.DeleteStateResponse](
			httpClient,
			baseURL+RunServiceDeleteProcedure,
			connect.WithSchema(runServiceDeleteMethodDescriptor),
			connect.WithClientOptions(opts...),
		),
		exists: connect.NewClient[v2.ExistsRequest, v2.ExistsResponse](
			httpClient,
			baseURL+RunServiceExistsProcedure,
			connect.WithSchema(runServiceExistsMethodDescriptor),
			connect.WithClientOptions(opts...),
		),
		updateMetadata: connect.NewClient[v2.UpdateMetadataRequest, v2.UpdateMetadataResponse](
			httpClient,
			baseURL+RunServiceUpdateMetadataProcedure,
			connect.WithSchema(runServiceUpdateMetadataMethodDescriptor),
			connect.WithClientOptions(opts...),
		),
		saveStep: connect.NewClient[v2.SaveStepRequest, v2.SaveStepResponse](
			httpClient,
			baseURL+RunServiceSaveStepProcedure,
			connect.WithSchema(runServiceSaveStepMethodDescriptor),
			connect.WithClientOptions(opts...),
		),
		loadMetadata: connect.NewClient[v2.LoadMetadataRequest, v2.LoadMetadataResponse](
			httpClient,
			baseURL+RunServiceLoadMetadataProcedure,
			connect.WithSchema(runServiceLoadMetadataMethodDescriptor),
			connect.WithClientOptions(opts...),
		),
		loadEvents: connect.NewClient[v2.LoadEventsRequest, v2.LoadEventsResponse](
			httpClient,
			baseURL+RunServiceLoadEventsProcedure,
			connect.WithSchema(runServiceLoadEventsMethodDescriptor),
			connect.WithClientOptions(opts...),
		),
		loadSteps: connect.NewClient[v2.LoadStepsRequest, v2.LoadStepsResponse](
			httpClient,
			baseURL+RunServiceLoadStepsProcedure,
			connect.WithSchema(runServiceLoadStepsMethodDescriptor),
			connect.WithClientOptions(opts...),
		),
		loadKV: connect.NewClient[v2.LoadKVRequest, v2.LoadKVResponse](
			httpClient,
			baseURL+RunServiceLoadKVProcedure,
			connect.WithSchema(runServiceLoadKVMethodDescriptor),
			connect.WithClientOptions(opts...),
		),
		loadState: connect.NewClient[v2.LoadStateRequest, v2.LoadStateResponse](
			httpClient,
			baseURL+RunServiceLoadStateProcedure,
			connect.WithSchema(runServiceLoadStateMethodDescriptor),
			connect.WithClientOptions(opts...),
		),
	}
}

// runServiceClient implements RunServiceClient.
type runServiceClient struct {
	create         *connect.Client[v2.CreateStateRequest, v2.CreateStateResponse]
	delete         *connect.Client[v2.DeleteStateRequest, v2.DeleteStateResponse]
	exists         *connect.Client[v2.ExistsRequest, v2.ExistsResponse]
	updateMetadata *connect.Client[v2.UpdateMetadataRequest, v2.UpdateMetadataResponse]
	saveStep       *connect.Client[v2.SaveStepRequest, v2.SaveStepResponse]
	loadMetadata   *connect.Client[v2.LoadMetadataRequest, v2.LoadMetadataResponse]
	loadEvents     *connect.Client[v2.LoadEventsRequest, v2.LoadEventsResponse]
	loadSteps      *connect.Client[v2.LoadStepsRequest, v2.LoadStepsResponse]
	loadKV         *connect.Client[v2.LoadKVRequest, v2.LoadKVResponse]
	loadState      *connect.Client[v2.LoadStateRequest, v2.LoadStateResponse]
}

// Create calls state.v2.RunService.Create.
func (c *runServiceClient) Create(ctx context.Context, req *connect.Request[v2.CreateStateRequest]) (*connect.Response[v2.CreateStateResponse], error) {
	return c.create.CallUnary(ctx, req)
}

// Delete calls state.v2.RunService.Delete.
func (c *runServiceClient) Delete(ctx context.Context, req *connect.Request[v2.DeleteStateRequest]) (*connect.Response[v2.DeleteStateResponse], error) {
	return c.delete.CallUnary(ctx, req)
}

// Exists calls state.v2.RunService.Exists.
func (c *runServiceClient) Exists(ctx context.Context, req *connect.Request[v2.ExistsRequest]) (*connect.Response[v2.ExistsResponse], error) {
	return c.exists.CallUnary(ctx, req)
}

// UpdateMetadata calls state.v2.RunService.UpdateMetadata.
func (c *runServiceClient) UpdateMetadata(ctx context.Context, req *connect.Request[v2.UpdateMetadataRequest]) (*connect.Response[v2.UpdateMetadataResponse], error) {
	return c.updateMetadata.CallUnary(ctx, req)
}

// SaveStep calls state.v2.RunService.SaveStep.
func (c *runServiceClient) SaveStep(ctx context.Context, req *connect.Request[v2.SaveStepRequest]) (*connect.Response[v2.SaveStepResponse], error) {
	return c.saveStep.CallUnary(ctx, req)
}

// LoadMetadata calls state.v2.RunService.LoadMetadata.
func (c *runServiceClient) LoadMetadata(ctx context.Context, req *connect.Request[v2.LoadMetadataRequest]) (*connect.Response[v2.LoadMetadataResponse], error) {
	return c.loadMetadata.CallUnary(ctx, req)
}

// LoadEvents calls state.v2.RunService.LoadEvents.
func (c *runServiceClient) LoadEvents(ctx context.Context, req *connect.Request[v2.LoadEventsRequest]) (*connect.Response[v2.LoadEventsResponse], error) {
	return c.loadEvents.CallUnary(ctx, req)
}

// LoadSteps calls state.v2.RunService.LoadSteps.
func (c *runServiceClient) LoadSteps(ctx context.Context, req *connect.Request[v2.LoadStepsRequest]) (*connect.Response[v2.LoadStepsResponse], error) {
	return c.loadSteps.CallUnary(ctx, req)
}

// LoadKV calls state.v2.RunService.LoadKV.
func (c *runServiceClient) LoadKV(ctx context.Context, req *connect.Request[v2.LoadKVRequest]) (*connect.Response[v2.LoadKVResponse], error) {
	return c.loadKV.CallUnary(ctx, req)
}

// LoadState calls state.v2.RunService.LoadState.
func (c *runServiceClient) LoadState(ctx context.Context, req *connect.Request[v2.LoadStateRequest]) (*connect.Response[v2.LoadStateResponse], error) {
	return c.loadState.CallUnary(ctx, req)
}

// RunServiceHandler is an implementation of the state.v2.RunService service.
type RunServiceHandler interface {
	Create(context.Context, *connect.Request[v2.CreateStateRequest]) (*connect.Response[v2.CreateStateResponse], error)
	Delete(context.Context, *connect.Request[v2.DeleteStateRequest]) (*connect.Response[v2.DeleteStateResponse], error)
	Exists(context.Context, *connect.Request[v2.ExistsRequest]) (*connect.Response[v2.ExistsResponse], error)
	UpdateMetadata(context.Context, *connect.Request[v2.UpdateMetadataRequest]) (*connect.Response[v2.UpdateMetadataResponse], error)
	SaveStep(context.Context, *connect.Request[v2.SaveStepRequest]) (*connect.Response[v2.SaveStepResponse], error)
	LoadMetadata(context.Context, *connect.Request[v2.LoadMetadataRequest]) (*connect.Response[v2.LoadMetadataResponse], error)
	LoadEvents(context.Context, *connect.Request[v2.LoadEventsRequest]) (*connect.Response[v2.LoadEventsResponse], error)
	LoadSteps(context.Context, *connect.Request[v2.LoadStepsRequest]) (*connect.Response[v2.LoadStepsResponse], error)
	LoadKV(context.Context, *connect.Request[v2.LoadKVRequest]) (*connect.Response[v2.LoadKVResponse], error)
	LoadState(context.Context, *connect.Request[v2.LoadStateRequest]) (*connect.Response[v2.LoadStateResponse], error)
}

// NewRunServiceHandler builds an HTTP handler from the service implementation. It returns the path
// on which to mount the handler and the handler itself.
//
// By default, handlers support the Connect, gRPC, and gRPC-Web protocols with the binary Protobuf
// and JSON codecs. They also support gzip compression.
func NewRunServiceHandler(svc RunServiceHandler, opts ...connect.HandlerOption) (string, http.Handler) {
	runServiceCreateHandler := connect.NewUnaryHandler(
		RunServiceCreateProcedure,
		svc.Create,
		connect.WithSchema(runServiceCreateMethodDescriptor),
		connect.WithHandlerOptions(opts...),
	)
	runServiceDeleteHandler := connect.NewUnaryHandler(
		RunServiceDeleteProcedure,
		svc.Delete,
		connect.WithSchema(runServiceDeleteMethodDescriptor),
		connect.WithHandlerOptions(opts...),
	)
	runServiceExistsHandler := connect.NewUnaryHandler(
		RunServiceExistsProcedure,
		svc.Exists,
		connect.WithSchema(runServiceExistsMethodDescriptor),
		connect.WithHandlerOptions(opts...),
	)
	runServiceUpdateMetadataHandler := connect.NewUnaryHandler(
		RunServiceUpdateMetadataProcedure,
		svc.UpdateMetadata,
		connect.WithSchema(runServiceUpdateMetadataMethodDescriptor),
		connect.WithHandlerOptions(opts...),
	)
	runServiceSaveStepHandler := connect.NewUnaryHandler(
		RunServiceSaveStepProcedure,
		svc.SaveStep,
		connect.WithSchema(runServiceSaveStepMethodDescriptor),
		connect.WithHandlerOptions(opts...),
	)
	runServiceLoadMetadataHandler := connect.NewUnaryHandler(
		RunServiceLoadMetadataProcedure,
		svc.LoadMetadata,
		connect.WithSchema(runServiceLoadMetadataMethodDescriptor),
		connect.WithHandlerOptions(opts...),
	)
	runServiceLoadEventsHandler := connect.NewUnaryHandler(
		RunServiceLoadEventsProcedure,
		svc.LoadEvents,
		connect.WithSchema(runServiceLoadEventsMethodDescriptor),
		connect.WithHandlerOptions(opts...),
	)
	runServiceLoadStepsHandler := connect.NewUnaryHandler(
		RunServiceLoadStepsProcedure,
		svc.LoadSteps,
		connect.WithSchema(runServiceLoadStepsMethodDescriptor),
		connect.WithHandlerOptions(opts...),
	)
	runServiceLoadKVHandler := connect.NewUnaryHandler(
		RunServiceLoadKVProcedure,
		svc.LoadKV,
		connect.WithSchema(runServiceLoadKVMethodDescriptor),
		connect.WithHandlerOptions(opts...),
	)
	runServiceLoadStateHandler := connect.NewUnaryHandler(
		RunServiceLoadStateProcedure,
		svc.LoadState,
		connect.WithSchema(runServiceLoadStateMethodDescriptor),
		connect.WithHandlerOptions(opts...),
	)
	return "/state.v2.RunService/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case RunServiceCreateProcedure:
			runServiceCreateHandler.ServeHTTP(w, r)
		case RunServiceDeleteProcedure:
			runServiceDeleteHandler.ServeHTTP(w, r)
		case RunServiceExistsProcedure:
			runServiceExistsHandler.ServeHTTP(w, r)
		case RunServiceUpdateMetadataProcedure:
			runServiceUpdateMetadataHandler.ServeHTTP(w, r)
		case RunServiceSaveStepProcedure:
			runServiceSaveStepHandler.ServeHTTP(w, r)
		case RunServiceLoadMetadataProcedure:
			runServiceLoadMetadataHandler.ServeHTTP(w, r)
		case RunServiceLoadEventsProcedure:
			runServiceLoadEventsHandler.ServeHTTP(w, r)
		case RunServiceLoadStepsProcedure:
			runServiceLoadStepsHandler.ServeHTTP(w, r)
		case RunServiceLoadKVProcedure:
			runServiceLoadKVHandler.ServeHTTP(w, r)
		case RunServiceLoadStateProcedure:
			runServiceLoadStateHandler.ServeHTTP(w, r)
		default:
			http.NotFound(w, r)
		}
	})
}

// UnimplementedRunServiceHandler returns CodeUnimplemented from all methods.
type UnimplementedRunServiceHandler struct{}

func (UnimplementedRunServiceHandler) Create(context.Context, *connect.Request[v2.CreateStateRequest]) (*connect.Response[v2.CreateStateResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("state.v2.RunService.Create is not implemented"))
}

func (UnimplementedRunServiceHandler) Delete(context.Context, *connect.Request[v2.DeleteStateRequest]) (*connect.Response[v2.DeleteStateResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("state.v2.RunService.Delete is not implemented"))
}

func (UnimplementedRunServiceHandler) Exists(context.Context, *connect.Request[v2.ExistsRequest]) (*connect.Response[v2.ExistsResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("state.v2.RunService.Exists is not implemented"))
}

func (UnimplementedRunServiceHandler) UpdateMetadata(context.Context, *connect.Request[v2.UpdateMetadataRequest]) (*connect.Response[v2.UpdateMetadataResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("state.v2.RunService.UpdateMetadata is not implemented"))
}

func (UnimplementedRunServiceHandler) SaveStep(context.Context, *connect.Request[v2.SaveStepRequest]) (*connect.Response[v2.SaveStepResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("state.v2.RunService.SaveStep is not implemented"))
}

func (UnimplementedRunServiceHandler) LoadMetadata(context.Context, *connect.Request[v2.LoadMetadataRequest]) (*connect.Response[v2.LoadMetadataResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("state.v2.RunService.LoadMetadata is not implemented"))
}

func (UnimplementedRunServiceHandler) LoadEvents(context.Context, *connect.Request[v2.LoadEventsRequest]) (*connect.Response[v2.LoadEventsResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("state.v2.RunService.LoadEvents is not implemented"))
}

func (UnimplementedRunServiceHandler) LoadSteps(context.Context, *connect.Request[v2.LoadStepsRequest]) (*connect.Response[v2.LoadStepsResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("state.v2.RunService.LoadSteps is not implemented"))
}

func (UnimplementedRunServiceHandler) LoadKV(context.Context, *connect.Request[v2.LoadKVRequest]) (*connect.Response[v2.LoadKVResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("state.v2.RunService.LoadKV is not implemented"))
}

func (UnimplementedRunServiceHandler) LoadState(context.Context, *connect.Request[v2.LoadStateRequest]) (*connect.Response[v2.LoadStateResponse], error) {
	return nil, connect.NewError(connect.CodeUnimplemented, errors.New("state.v2.RunService.LoadState is not implemented"))
}
