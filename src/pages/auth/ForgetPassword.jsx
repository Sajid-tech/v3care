import { Input, Button, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../base/BaseUrl";
import { toast } from "react-toastify";
import ButtonConfigColor from "../../components/common/ButtonConfig/ButtonConfigColor";

const ForgetPassword = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const onResetPassword = (e) => {
    e.preventDefault();

    if (email !== "" && username !== "") {
      setLoading(true); // Start loading

      fetch(
        `${BASE_URL}/api/panel-send-password?username=${username}&email=${email}`,
        {
          method: "POST",
        }
      )
        .then((response) => response.json())
        .then((response) => {
          toast.success("New Password Sent to your Email");
        })
        .catch((error) => {
          toast.error("Email Not sent.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      toast.warning("Please enter a Username & Email");
    }
  };

  return (
    <section className="flex flex-col lg:flex-row min-h-screen">
      <div className="flex-1 flex items-center bg-[url('/img/fp.jpg')]  bg-cover bg-center bg-no-repeat justify-center px-4 lg:px-8 py-12 lg:w-1/2">
        <div className="w-full max-w-md p-8 bg-white/90  rounded-xl shadow-lg  shadow-blue-500 ">
          <div className="flex justify-between mb-4">
            <div>
              <h2 className="font-bold text-2xl text-[#002D74]">
                Forget Password
              </h2>
              <p className="text-xs mt-4 text-[#002D74]">
                Get started with V3Care
              </p>
            </div>
            <img
              src="/img/v3logo.png"
              alt="V3 care  Logo"
              className="h-14 w-auto rounded-lg  "
            />
          </div>
          <form
            method="POST"
            className="mt-8 mb-2 w-full"
            onSubmit={onResetPassword}
          >
            <div className="mb-6 flex flex-col gap-6">
              <Typography
                variant="small"
                color="blue-gray"
                className="-mb-3 font-medium"
              >
                Username
              </Typography>
              <Input
                id="username"
                name="username"
                size="lg"
                placeholder="Enter your username"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Typography
                variant="small"
                color="blue-gray"
                className="-mb-3 font-medium"
              >
                Email Address
              </Typography>
              <Input
                id="email"
                name="email"
                type="email"
                size="lg"
                placeholder="name@gmail.com"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <ButtonConfigColor
              type="default"
              buttontype="submit"
              label="Forget Password"
              loading={loading}
              className="w-full"
            />
            <div className="flex items-center justify-between gap-2 mt-6">
              <Typography
                variant="paragraph"
                className="text-center text-blue-gray-500 font-medium mt-4"
              >
                Remembered your password?
                <Link to="/" className="text-gray-900 ml-1">
                  Sign In
                </Link>
              </Typography>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;
