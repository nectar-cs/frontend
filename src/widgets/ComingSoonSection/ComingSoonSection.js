import React, {Fragment} from "react";
import S from './ComingSoonSectionStyles'

export default function ComingSoonSection({text}){
  return(
    <Fragment>
      <S.Title>Coming Soon</S.Title>
      <S.Icon src='https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/fbaf683e-334f-40ec-986c-48744c00d132/d2xzwrw-cee5f06e-8cef-4db9-933e-c91eaf5f1d04.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2ZiYWY2ODNlLTMzNGYtNDBlYy05ODZjLTQ4NzQ0YzAwZDEzMlwvZDJ4endydy1jZWU1ZjA2ZS04Y2VmLTRkYjktOTMzZS1jOTFlYWY1ZjFkMDQuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.2uwd3JXIyJvTbTJqJAOEkzA4dVQi6BJIqhjdS0U4hRg'/>
      <p>{text}</p>
    </Fragment>
  )
}