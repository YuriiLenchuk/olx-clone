"use client"

import styled from 'styled-components';

const Wrapper = styled.div`
    font-family: inherit;
    position: relative;
`;

const Selected = styled.div`
    padding: 0 16px;
    height: 48px;
    min-width: 250px;
    margin: 0 0 0 10px;
    background-color: var(--surface);
    border: 1px solid rgba(63, 111, 88, 0.12);
    border-radius: 999px;
    cursor: pointer;
    user-select: none;
    color: var(--text);
    position: relative;
    transition: border-color 0.12s ease, box-shadow 0.12s ease;
    display: flex;
`;

const SelectedItem = styled.div`
    align-self: center;
`;

const Arrow = styled.span<{ $rotated: boolean }>`
    pointer-events: none;
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%) rotate(${props => (props.$rotated ? '180deg' : '0deg')});
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    color: var(--primary);
    transition: transform 0.2s ease;
`;

const OptionsList = styled.ul`
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    background-color: var(--surface);
    border: 1px solid rgba(63, 111, 88, 0.12);
    border-radius: 26px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
    list-style: none;
    margin: 0;
    min-width: 250px;
    padding: 0;
    max-height: 220px;
    overflow-y: auto;
    z-index: 10;
`;

const OptionItem = styled.li`
    padding: 16px;
    cursor: pointer;
    color: var(--text);
    font-size: 14px;
    align-items: center;
    display: flex;
    justify-content: space-between;

    &:hover {
        background-color: rgb(2, 40, 44);
        color: white;
    }
`;

export {
    Wrapper,
    Selected,
    SelectedItem,
    OptionsList,
    OptionItem,
    Arrow,
};