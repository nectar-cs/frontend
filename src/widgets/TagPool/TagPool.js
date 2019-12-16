//@flow
import {useAutocomplete} from "@material-ui/lab";
import {Container, InputWrapper, Listbox, Tag} from "./TagPoolStyles";
import React from "react";

export default function TagPool(props: Props){

    const {
      getRootProps,
      getInputProps,
      getTagProps,
      getListboxProps,
      getOptionProps,
      groupedOptions,
      value,
      focused,
      setAnchorEl,
    } = useAutocomplete({
      id: 'customized-hook-demo',
      defaultValue: [],
      multiple: true,
      options: top100Films,
      getOptionLabel: option => option.title,
    });

    return(
      <Container>
        <div {...getRootProps()}>
          <InputWrapper ref={setAnchorEl} className={focused ? 'focused' : ''}>
            {value.map((option, index) => (
              <Tag label={option.title} {...getTagProps({ index })} />
            ))}

            <input {...getInputProps()} />
          </InputWrapper>
        </div>
        {groupedOptions.length > 0 ? (
          <Listbox {...getListboxProps()}>
            {groupedOptions.map((option, index) => (
              <li {...getOptionProps({ option, index })}>
                <span>{option.title}</span>
              </li>
            ))}
          </Listbox>
        ) : null}
      </Container>
    )
  }

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'Monty Python and the Holy Grail', year: 1975 }
];

type Props = {
};