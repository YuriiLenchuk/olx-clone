"use client"

import {ReactNode, useState, useEffect} from 'react';
import {Wrapper, OptionItem, OptionsList, Selected, Arrow, SelectedItem} from "@/components/CustomSelect/styled";
import ArrowDown from "@/icons/ArrowDown";
import Check from "@/icons/Check";

type Option = { value: string; label: ReactNode };

type Props = {
    options: Option[];
    value?: string;
    onChange?: (value: string) => void;
};


export default function CustomSelect({ options, value, onChange }: Props) {
    const [open, setOpen] = useState(false);

    const selectedLabel = options.find(opt => opt.value === value)?.label;

    const toggleOpen = () => setOpen(o => !o);

    const handleSelect = (val: string) => {
        onChange?.(val);
        setOpen(false);
    };


// Закривати меню при кліку поза елементом
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!(e.target as HTMLElement).closest('[data-custom-select]')) {
                setOpen(false);
            }
        };
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, []);


    return (
        <Wrapper data-custom-select>
            <Selected open={open} onClick={toggleOpen}>
                <SelectedItem>
                    {selectedLabel ?? <span style={{ color: '#9ca3af' }}>Select...</span>}
                </SelectedItem>
                <Arrow rotated={open}>
                    <ArrowDown width={28}/>
                </Arrow>
            </Selected>


            {open && (
                <OptionsList>
                    {options.map(opt => (
                        <OptionItem key={String(opt.value)} onClick={() => handleSelect(opt.value)}>
                            {opt.label}
                            {(opt.value == value ) && <Check width={20} />}
                        </OptionItem>
                    ))}
                </OptionsList>
            )}
        </Wrapper>
    );
}