// Code generated by "enumer -trimprefix=AppConnectionType -type=AppConnectionType -json -gqlgen -sql -text -transform=snake"; DO NOT EDIT.

package enums

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"io"
	"strconv"
	"strings"
)

const _AppConnectionTypeName = "serverlessconnect"

var _AppConnectionTypeIndex = [...]uint8{0, 10, 17}

const _AppConnectionTypeLowerName = "serverlessconnect"

func (i AppConnectionType) String() string {
	if i < 0 || i >= AppConnectionType(len(_AppConnectionTypeIndex)-1) {
		return fmt.Sprintf("AppConnectionType(%d)", i)
	}
	return _AppConnectionTypeName[_AppConnectionTypeIndex[i]:_AppConnectionTypeIndex[i+1]]
}

// An "invalid array index" compiler error signifies that the constant values have changed.
// Re-run the stringer command to generate them again.
func _AppConnectionTypeNoOp() {
	var x [1]struct{}
	_ = x[AppConnectionTypeServerless-(0)]
	_ = x[AppConnectionTypeConnect-(1)]
}

var _AppConnectionTypeValues = []AppConnectionType{AppConnectionTypeServerless, AppConnectionTypeConnect}

var _AppConnectionTypeNameToValueMap = map[string]AppConnectionType{
	_AppConnectionTypeName[0:10]:       AppConnectionTypeServerless,
	_AppConnectionTypeLowerName[0:10]:  AppConnectionTypeServerless,
	_AppConnectionTypeName[10:17]:      AppConnectionTypeConnect,
	_AppConnectionTypeLowerName[10:17]: AppConnectionTypeConnect,
}

var _AppConnectionTypeNames = []string{
	_AppConnectionTypeName[0:10],
	_AppConnectionTypeName[10:17],
}

// AppConnectionTypeString retrieves an enum value from the enum constants string name.
// Throws an error if the param is not part of the enum.
func AppConnectionTypeString(s string) (AppConnectionType, error) {
	if val, ok := _AppConnectionTypeNameToValueMap[s]; ok {
		return val, nil
	}

	if val, ok := _AppConnectionTypeNameToValueMap[strings.ToLower(s)]; ok {
		return val, nil
	}
	return 0, fmt.Errorf("%s does not belong to AppConnectionType values", s)
}

// AppConnectionTypeValues returns all values of the enum
func AppConnectionTypeValues() []AppConnectionType {
	return _AppConnectionTypeValues
}

// AppConnectionTypeStrings returns a slice of all String values of the enum
func AppConnectionTypeStrings() []string {
	strs := make([]string, len(_AppConnectionTypeNames))
	copy(strs, _AppConnectionTypeNames)
	return strs
}

// IsAAppConnectionType returns "true" if the value is listed in the enum definition. "false" otherwise
func (i AppConnectionType) IsAAppConnectionType() bool {
	for _, v := range _AppConnectionTypeValues {
		if i == v {
			return true
		}
	}
	return false
}

// MarshalJSON implements the json.Marshaler interface for AppConnectionType
func (i AppConnectionType) MarshalJSON() ([]byte, error) {
	return json.Marshal(i.String())
}

// UnmarshalJSON implements the json.Unmarshaler interface for AppConnectionType
func (i *AppConnectionType) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return fmt.Errorf("AppConnectionType should be a string, got %s", data)
	}

	var err error
	*i, err = AppConnectionTypeString(s)
	return err
}

// MarshalText implements the encoding.TextMarshaler interface for AppConnectionType
func (i AppConnectionType) MarshalText() ([]byte, error) {
	return []byte(i.String()), nil
}

// UnmarshalText implements the encoding.TextUnmarshaler interface for AppConnectionType
func (i *AppConnectionType) UnmarshalText(text []byte) error {
	var err error
	*i, err = AppConnectionTypeString(string(text))
	return err
}

func (i AppConnectionType) Value() (driver.Value, error) {
	return i.String(), nil
}

func (i *AppConnectionType) Scan(value interface{}) error {
	if value == nil {
		return nil
	}

	var str string
	switch v := value.(type) {
	case []byte:
		str = string(v)
	case string:
		str = v
	case fmt.Stringer:
		str = v.String()
	default:
		return fmt.Errorf("invalid value of AppConnectionType: %[1]T(%[1]v)", value)
	}

	val, err := AppConnectionTypeString(str)
	if err != nil {
		return err
	}

	*i = val
	return nil
}

// MarshalGQL implements the graphql.Marshaler interface for AppConnectionType
func (i AppConnectionType) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(i.String()))
}

// UnmarshalGQL implements the graphql.Unmarshaler interface for AppConnectionType
func (i *AppConnectionType) UnmarshalGQL(value interface{}) error {
	str, ok := value.(string)
	if !ok {
		return fmt.Errorf("AppConnectionType should be a string, got %T", value)
	}

	var err error
	*i, err = AppConnectionTypeString(str)
	return err
}
