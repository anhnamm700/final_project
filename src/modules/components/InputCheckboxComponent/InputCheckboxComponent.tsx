import { components } from "react-select";
import { default as ReactSelect } from "react-select";

import style from './style.module.scss';

interface Props {
    data: any[],
    value: any,
    handleChange: (e: any) => void
}

const Option = (props: any) => {
    return (
        <div>
          <components.Option {...props}>
            <input
              type="checkbox"
              checked={props.isSelected}
              onChange={() => null}
            />{" "}
            <label>{props.label}</label>
          </components.Option>
        </div>
      );
}

const  InputCheckboxComponent = (props: Props) => {
    const { data, value, handleChange } = props;

    return (
        <ReactSelect
          className={style.reactSelect}
          options={data}
          isMulti
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{
            Option
          }}
          onChange={handleChange}
          value={value}
        />
    )
}

export default InputCheckboxComponent;