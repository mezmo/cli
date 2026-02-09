package core

import (
	"fmt"
	"reflect"
	"strings"
)

func GetStructField(s interface{}, fieldName string) interface{} {
	v := reflect.ValueOf(s)

	// Ensure the input is actually a struct type
	if v.Kind() != reflect.Struct {
		fmt.Printf("Error: %v is not a struct\n", s)
		return nil
	}

	// Get the field by name
	field := v.FieldByName(fieldName)

	// Check if the field exists
	if !field.IsValid() {
		fmt.Printf("Error: Field %s not found in struct\n", fieldName)
		return nil
	}

	// Use .Interface() to return the actual value stored in the field
	return field.Interface()
}

// GetFieldValue is a more flexible function that can work with both structs and interfaces
// It tries multiple field name variations and can handle interface{} types
func GetFieldValue(obj interface{}, fieldName string) interface{} {
	if obj == nil {
		fmt.Printf("Error: Cannot get field %s from nil object\n", fieldName)
		return nil
	}

	v := reflect.ValueOf(obj)

	// If it's a pointer, get the element it points to
	if v.Kind() == reflect.Ptr {
		if v.IsNil() {
			fmt.Printf("Error: Cannot get field %s from nil pointer\n", fieldName)
			return nil
		}
		v = v.Elem()
	}

	// Handle interface{} by getting the concrete value
	if v.Kind() == reflect.Interface {
		if v.IsNil() {
			fmt.Printf("Error: Cannot get field %s from nil interface\n", fieldName)
			return nil
		}
		v = v.Elem()
	}

	// Ensure we have a struct
	if v.Kind() != reflect.Struct {
		fmt.Printf("Error: %v (type %T) is not a struct, cannot get field %s\n", obj, obj, fieldName)
		return nil
	}

	// Try different field name variations
	fieldNames := []string{
		fieldName,                    // Original name
		strings.Title(fieldName),     // Title case (first letter uppercase)
		strings.ToLower(fieldName),   // All lowercase
		strings.ToUpper(fieldName),   // All uppercase
	}

	for _, fname := range fieldNames {
		field := v.FieldByName(fname)
		if field.IsValid() {
			return field.Interface()
		}
	}

	// If no field found, list available fields for debugging
	t := v.Type()
	var availableFields []string
	for i := 0; i < t.NumField(); i++ {
		availableFields = append(availableFields, t.Field(i).Name)
	}

	fmt.Printf("Error: Field %s not found in struct. Available fields: %v\n", fieldName, availableFields)
	return nil
}

// GetValue is the most flexible function that can work with structs, maps, and interfaces
// It handles multiple data types and field name variations
func GetValue(obj interface{}, key string) interface{} {
	if obj == nil {
		fmt.Printf("Error: Cannot get key %s from nil object\n", key)
		return nil
	}

	v := reflect.ValueOf(obj)

	// Handle pointers
	if v.Kind() == reflect.Ptr {
		if v.IsNil() {
			fmt.Printf("Error: Cannot get key %s from nil pointer\n", key)
			return nil
		}
		v = v.Elem()
	}

	// Handle interfaces
	if v.Kind() == reflect.Interface {
		if v.IsNil() {
			fmt.Printf("Error: Cannot get key %s from nil interface\n", key)
			return nil
		}
		v = v.Elem()
	}

	switch v.Kind() {
	case reflect.Struct:
		// Use GetFieldValue for structs
		return GetFieldValue(v.Interface(), key)

	case reflect.Map:
		// Handle maps
		keyVariations := []reflect.Value{
			reflect.ValueOf(key),
			reflect.ValueOf(strings.Title(key)),
			reflect.ValueOf(strings.ToLower(key)),
			reflect.ValueOf(strings.ToUpper(key)),
		}

		for _, keyVar := range keyVariations {
			if keyVar.Type() == v.Type().Key() {
				mapValue := v.MapIndex(keyVar)
				if mapValue.IsValid() {
					return mapValue.Interface()
				}
			}
		}

		// List available keys for debugging
		var availableKeys []string
		for _, k := range v.MapKeys() {
			availableKeys = append(availableKeys, fmt.Sprintf("%v", k.Interface()))
		}
		fmt.Printf("Error: Key %s not found in map. Available keys: %v\n", key, availableKeys)
		return nil

	default:
		fmt.Printf("Error: %v (type %T) is not a struct or map, cannot get key %s\n", obj, obj, key)
		return nil
	}
}

// GetResource safely retrieves a resource and returns it as IResource
// This allows calling methods on the resource without type assertion errors
func GetResource(obj interface{}, resourceName string) interface{} {
	resource := GetValue(obj, resourceName)
	if resource == nil {
		return nil
	}

	// The resource should already be the correct interface type
	// since it comes from our VERSIONS structure
	return resource
}

// AsResourceInterface safely converts an interface{} to a resource interface
// This allows calling resource methods on values retrieved as interface{}
func AsResourceInterface(obj interface{}) ResourceInterface {
	if obj == nil {
		return nil
	}

	// Try to assert to a resource interface
	if resource, ok := obj.(ResourceInterface); ok {
		return resource
	}

	// If direct assertion fails, create a wrapper using reflection
	return &ReflectionResourceWrapper{obj: obj}
}

// ResourceInterface defines the common methods that all resources should have
type ResourceInterface interface {
	Get(string, map[string]string) (interface{}, error)
	List(map[string]string) (interface{}, error)
	GetBySpec(interface{}) (interface{}, error)
	Create(interface{}) (interface{}, error)
	Remove(string) error
	RemoveBySpec(interface{}) error
	Update(interface{}) (interface{}, error)
	Template() []byte
}

// ReflectionResourceWrapper wraps any object and provides resource methods via reflection
type ReflectionResourceWrapper struct {
	obj interface{}
}

func (w *ReflectionResourceWrapper) Get(pk string, params map[string]string) (interface{}, error) {
	return CallResourceMethod(w.obj, "Get", pk, params)
}

func (w *ReflectionResourceWrapper) List(params map[string]string) (interface{}, error) {
	return CallResourceMethod(w.obj, "List", params)
}

func (w *ReflectionResourceWrapper) GetBySpec(spec interface{}) (interface{}, error) {
	return CallResourceMethod(w.obj, "GetBySpec", spec)
}

func (w *ReflectionResourceWrapper) Create(spec interface{}) (interface{}, error) {
	return CallResourceMethod(w.obj, "Create", spec)
}

func (w *ReflectionResourceWrapper) Remove(pk string) error {
	result, err := CallResourceMethod(w.obj, "Remove", pk)
	if err != nil {
		return err
	}
	if result != nil {
		if resultErr, ok := result.(error); ok {
			return resultErr
		}
	}
	return nil
}

func (w *ReflectionResourceWrapper) RemoveBySpec(spec interface{}) error {
	result, err := CallResourceMethod(w.obj, "RemoveBySpec", spec)
	if err != nil {
		return err
	}
	if result != nil {
		if resultErr, ok := result.(error); ok {
			return resultErr
		}
	}
	return nil
}

func (w *ReflectionResourceWrapper) Update(spec interface{}) (interface{}, error) {
	return CallResourceMethod(w.obj, "Update", spec)
}

func (w *ReflectionResourceWrapper) Template() []byte {
	result, err := CallResourceMethod(w.obj, "Template")
	if err != nil {
		return nil
	}
	if bytes, ok := result.([]byte); ok {
		return bytes
	}
	return nil
}

// CallResourceMethod safely calls a method on a resource interface
// This provides a type-safe way to call methods on resources retrieved as interface{}
func CallResourceMethod(resource interface{}, methodName string, args ...interface{}) (interface{}, error) {
	if resource == nil {
		return nil, fmt.Errorf("cannot call %s on nil resource", methodName)
	}

	v := reflect.ValueOf(resource)
	method := v.MethodByName(methodName)

	if !method.IsValid() {
		return nil, fmt.Errorf("method %s not found on resource type %T", methodName, resource)
	}

	// Convert arguments to reflect.Value
	var reflectArgs []reflect.Value
	for _, arg := range args {
		reflectArgs = append(reflectArgs, reflect.ValueOf(arg))
	}

	// Call the method
	results := method.Call(reflectArgs)

	// Handle different return patterns
	switch len(results) {
	case 0:
		return nil, nil
	case 1:
		// Single return value (could be error or result)
		result := results[0].Interface()
		if err, ok := result.(error); ok {
			return nil, err
		}
		return result, nil
	case 2:
		// Two return values (result, error)
		result := results[0].Interface()
		if results[1].Interface() != nil {
			err := results[1].Interface().(error)
			return result, err
		}
		return result, nil
	default:
		return results, nil
	}
}
