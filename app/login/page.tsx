import AuthForm from "@/components/login/auth-client-component";
import { metaDataGeneratorForNormalPage } from "@/hoook/generate-meta";

export const metadata = metaDataGeneratorForNormalPage("Login");
const LoginPage = () => {
  return <AuthForm pageType="login" />;
};

export default LoginPage;
