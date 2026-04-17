package log

const PROMPT_TRIGGER string = "__MZ_DO_PROMPT_TRIGGER__"

type ViewSelection struct {
	ID     string
	IsSet  bool
	Prompt bool
}

func (v *ViewSelection) String() string {
	return v.ID
}

func (v *ViewSelection) Set(input string) error {
	v.IsSet = true
	if input == "" || input == PROMPT_TRIGGER {
		v.Prompt = true
	} else {
		v.ID = input
		v.Prompt = false
	}

	return nil
}

func (v *ViewSelection) Type() string {
	return "string"
}
