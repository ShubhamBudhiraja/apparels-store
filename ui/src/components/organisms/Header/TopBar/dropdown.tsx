import React, { useState } from 'react';
import style from './index.module.scss';
import { IDropdownOptions } from 'src/lib/interface/common';
import { Dropdown } from 'react-bootstrap';

interface ITopBarDropDown {
    options?: IDropdownOptions[];
    selected?: IDropdownOptions;
    setSelected?: React.Dispatch<React.SetStateAction<IDropdownOptions | undefined>>;
}

const TopBarDropDown = (props: ITopBarDropDown) => {
    const { options, selected, setSelected } = props;

    const [toggle, setToggle] = useState(false);

    return (
        <Dropdown
            className={style.selectorDropdown}
            onToggle={(isOpen) => {
                setToggle(isOpen);
            }}
            show={toggle}
        >
            <Dropdown.Toggle role="button" type="button" className={style.selectedValue}>
                <span>{selected?.title}</span>
                <i className="font icon-down"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu className={style.options}>
                {options?.map((option: IDropdownOptions, index: number) => (
                    <button
                        key={`topbar_option_${index}`}
                        onClick={() => {
                            setSelected?.(option);
                            setToggle(false);
                        }}
                    >
                        {option?.title}
                    </button>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default TopBarDropDown;
