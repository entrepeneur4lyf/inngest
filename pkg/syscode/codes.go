package syscode

const (
	CodeBatchSizeInvalid          = "batch_size_invalid"
	CodeBatchTimeoutInvalid       = "batch_timeout_invalid"
	CodeComboUnsupported          = "combo_unsupported"
	CodeConcurrencyLimitInvalid   = "concurrency_limit_invalid"
	CodeConfigInvalid             = "config_invalid"
	CodeHTTPMissingHeader         = "http_missing_header"
	CodeHTTPNotOK                 = "http_not_ok"
	CodeHTTPUnreachable           = "http_unreachable"
	CodeNotSDK                    = "not_sdk"
	CodeOutputTooLarge            = "output_too_large"
	CodeSigVerificationFailed     = "sig_verification_failed"
	CodeUnknown                   = "unknown"
	CodeBatchKeyExpressionInvalid = "batch_key_expression_invalid"

	// Connect
	CodeConnectHelloTimeout        = "connect_hello_timeout"
	CodeConnectHelloInvalidMsg     = "connect_hello_invalid_msg"
	CodeConnectHelloInvalidPayload = "connect_hello_invalid_payload"
	CodeConnectAuthFailed          = "connect_authentication_failed"
	CodeConnectConnNotSaved        = "connect_connection_not_saved"
	CodeConnectInternal            = "connect_internal_error"
)
