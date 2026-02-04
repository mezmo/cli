package view

import (
	"errors"
	"fmt"
	"mzm/core/resource"
	"strings"
)

func Get(pk string, params map[string]string) (*View, error) {
	client := resource.Client()
	response := View{}
	res, err := client.
		R().
		SetResult(response).
		SetPathParam("pk", pk).
		Get("/v1/config/view/{pk}")

	if err != nil {
		return nil, err
	}

	switch res.StatusCode() {
	case 200:
		return res.Result().(*View), nil
	case 401:
		fmt.Println("Unauthorized")
	case 403:
		fmt.Println("Forbidden")
	case 404:
		break
	default:
		return nil, errors.New("unexpected error")
	}

	views, err := List(params)

	if err != nil {
		return nil, err
	}

	for _, instance := range *views {
		fmt.Println(instance.PK(), pk)
		if instance.PK() == pk {
			return &instance, nil
		}

		if strings.EqualFold(string(instance.Name), pk) {
			return &instance, nil
		}
	}
	return nil, nil
}

func List(params map[string]string) (*[]View, error) {
	client := resource.Client()
	var response []View

	res, err := client.
		R().
		SetResult(response).
		Get("/v1/config/view")

	if err != nil {
		return nil, err
	}

	return res.Result().(*[]View), nil
}

func GetBySpec(spec *View) (*View, error) {
	return nil, errors.New("GetBySpec() Not Implemented")
}

func Create(spec resource.IResourceTemplate) (*View, error) {
	return nil, errors.New("Create() Not Implemented")
}

func Remove(pk string) error {
	return errors.New("Remove() Not Implemented")
}

func RemoveBySpec(view *View) error {
	return errors.New("RemoveBySpec() Not Implemented")
}

func Update(spec resource.IResourceTemplate) (*View, error) {
	return nil, errors.New("Update() Not Implemented")
}
