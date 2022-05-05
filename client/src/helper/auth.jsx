import { useCookies } from 'react-cookie';

function IsAuthenticated() {
  const [cookies] = useCookies(['user']);
  return cookies["user"]
}

export default IsAuthenticated