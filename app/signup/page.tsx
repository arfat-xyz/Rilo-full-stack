import AuthForm from "@/components/login/auth-client-component";
import { metaDataGeneratorForNormalPage } from "@/hoook/generate-meta";

export const metadata = metaDataGeneratorForNormalPage("Sign UP");
const SignupPage = () => {
  return <AuthForm pageType="signup" />;
};

export default SignupPage;
