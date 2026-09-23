import { register as registerReq } from "@/06-shared/api/auth/register"
import { useNotifyError } from "@/06-shared/lib/useNotifyError"
import { PopupButton, PopupInput, PopupWindow } from "@/06-shared/ui/popups"
import { useState } from "react"

type props = {
  isOpen: boolean
  onSuccess: () => void
  onClose: () => void
}

export const Register = (
  {
    isOpen,
    onSuccess,
    onClose
  } : props
) => {
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [inviteCode, setInviteCode] = useState<string>("");
  const showError = useNotifyError()

  const onRegister = async () => {
    try {
      await registerReq({
        login: login,
        password: password,
        invite_code: inviteCode
      });
      onSuccess();
    } catch (error) {
      showError(error)
    } finally {
      onClose()
    }
  };

  return (
    isOpen ? (
      <PopupWindow name="Регистрация" onClose={() => {onClose()}}>
        <PopupInput 
          name="Логин" 
          setInput={(data) => setLogin(data)}
          autoFocus={true}
        />
        <PopupInput 
          name="Пароль" 
          setInput={(data) => setPassword(data)}
          autoFocus={false}
        />
        <PopupInput 
          name="Инвайт код" 
          setInput={(data) => setInviteCode(data)}
          onEnter={onRegister}
          autoFocus={false}
        />
        <PopupButton name="[Ok]" onClick={() => onRegister()}/>
      </PopupWindow>
    ) : null
  )
}