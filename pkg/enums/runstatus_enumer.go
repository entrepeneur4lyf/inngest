// Code generated by "enumer -trimprefix=RunStatus -type=RunStatus -json -text -gqlgen"; DO NOT EDIT.

package enums

import (
	"encoding/json"
	"fmt"
	"io"
	"strconv"
	"strings"
)

const _RunStatusName = "RunningCompletedFailedCancelledOverflowedScheduled"

var _RunStatusIndex = [...]uint8{0, 7, 16, 22, 31, 41, 50}

const _RunStatusLowerName = "runningcompletedfailedcancelledoverflowedscheduled"

func (i RunStatus) String() string {
	if i < 0 || i >= RunStatus(len(_RunStatusIndex)-1) {
		return fmt.Sprintf("RunStatus(%d)", i)
	}
	return _RunStatusName[_RunStatusIndex[i]:_RunStatusIndex[i+1]]
}

// An "invalid array index" compiler error signifies that the constant values have changed.
// Re-run the stringer command to generate them again.
func _RunStatusNoOp() {
	var x [1]struct{}
	_ = x[RunStatusRunning-(0)]
	_ = x[RunStatusCompleted-(1)]
	_ = x[RunStatusFailed-(2)]
	_ = x[RunStatusCancelled-(3)]
	_ = x[RunStatusOverflowed-(4)]
	_ = x[RunStatusScheduled-(5)]
}

var _RunStatusValues = []RunStatus{RunStatusRunning, RunStatusCompleted, RunStatusFailed, RunStatusCancelled, RunStatusOverflowed, RunStatusScheduled}

var _RunStatusNameToValueMap = map[string]RunStatus{
	_RunStatusName[0:7]:        RunStatusRunning,
	_RunStatusLowerName[0:7]:   RunStatusRunning,
	_RunStatusName[7:16]:       RunStatusCompleted,
	_RunStatusLowerName[7:16]:  RunStatusCompleted,
	_RunStatusName[16:22]:      RunStatusFailed,
	_RunStatusLowerName[16:22]: RunStatusFailed,
	_RunStatusName[22:31]:      RunStatusCancelled,
	_RunStatusLowerName[22:31]: RunStatusCancelled,
	_RunStatusName[31:41]:      RunStatusOverflowed,
	_RunStatusLowerName[31:41]: RunStatusOverflowed,
	_RunStatusName[41:50]:      RunStatusScheduled,
	_RunStatusLowerName[41:50]: RunStatusScheduled,
}

var _RunStatusNames = []string{
	_RunStatusName[0:7],
	_RunStatusName[7:16],
	_RunStatusName[16:22],
	_RunStatusName[22:31],
	_RunStatusName[31:41],
	_RunStatusName[41:50],
}

// RunStatusString retrieves an enum value from the enum constants string name.
// Throws an error if the param is not part of the enum.
func RunStatusString(s string) (RunStatus, error) {
	if val, ok := _RunStatusNameToValueMap[s]; ok {
		return val, nil
	}

	if val, ok := _RunStatusNameToValueMap[strings.ToLower(s)]; ok {
		return val, nil
	}
	return 0, fmt.Errorf("%s does not belong to RunStatus values", s)
}

// RunStatusValues returns all values of the enum
func RunStatusValues() []RunStatus {
	return _RunStatusValues
}

// RunStatusStrings returns a slice of all String values of the enum
func RunStatusStrings() []string {
	strs := make([]string, len(_RunStatusNames))
	copy(strs, _RunStatusNames)
	return strs
}

// IsARunStatus returns "true" if the value is listed in the enum definition. "false" otherwise
func (i RunStatus) IsARunStatus() bool {
	for _, v := range _RunStatusValues {
		if i == v {
			return true
		}
	}
	return false
}

// MarshalJSON implements the json.Marshaler interface for RunStatus
func (i RunStatus) MarshalJSON() ([]byte, error) {
	return json.Marshal(i.String())
}

// UnmarshalJSON implements the json.Unmarshaler interface for RunStatus
func (i *RunStatus) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return fmt.Errorf("RunStatus should be a string, got %s", data)
	}

	var err error
	*i, err = RunStatusString(s)
	return err
}

// MarshalText implements the encoding.TextMarshaler interface for RunStatus
func (i RunStatus) MarshalText() ([]byte, error) {
	return []byte(i.String()), nil
}

// UnmarshalText implements the encoding.TextUnmarshaler interface for RunStatus
func (i *RunStatus) UnmarshalText(text []byte) error {
	var err error
	*i, err = RunStatusString(string(text))
	return err
}

// MarshalGQL implements the graphql.Marshaler interface for RunStatus
func (i RunStatus) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(i.String()))
}

// UnmarshalGQL implements the graphql.Unmarshaler interface for RunStatus
func (i *RunStatus) UnmarshalGQL(value interface{}) error {
	str, ok := value.(string)
	if !ok {
		return fmt.Errorf("RunStatus should be a string, got %T", value)
	}

	var err error
	*i, err = RunStatusString(str)
	return err
}
