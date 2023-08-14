import RegisterButton from "../../../../components/common/RegisterButton";

const RegistrationContainer = () => {
  return (
    <div className="text-xs flex justify-center items-center">
      <div className="pr-2">Don't have an account?</div>
      <RegisterButton />
    </div>
  );
};

export default RegistrationContainer;
