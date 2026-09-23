import { login as loginReq } from "@/06-shared/api/auth/login"
import { useNotifyError } from "@/06-shared/lib/useNotifyError"
import { PopupButton, PopupInput, PopupWindow } from "@/06-shared/ui/popups"
import { useState } from "react"

type props = {
  isOpen: boolean
  onSuccess: () => void
  onClose: () => void
}

export const Login = (
  {
    isOpen,
    onSuccess,
    onClose
  } : props
) => {
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const showError = useNotifyError()

  const onLogin = async () => {
    try {
      await loginReq({
        login: login,
        password: password
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
      <PopupWindow name="Вход" onClose={() => {onClose()}}>
        <PopupInput 
          name="Логин" 
          setInput={(data) => setLogin(data)}
          autoFocus={true}
        />
        <PopupInput 
          name="Пароль" 
          setInput={(data) => setPassword(data)}
          onEnter={onLogin}
          autoFocus={false}
        />
        <PopupButton name="[Ok]" onClick={() => onLogin()}/>
      </PopupWindow>
    ) : null
  )
}