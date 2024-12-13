import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { z } from "zod";
import hpas from "../assets/Images/hpas.svg";
import hpas2 from "../assets/Images/hpas2.svg";
import hpas3 from "../assets/Images/hpas3.svg";
import hpas4 from "../assets/Images/hpas4.svg";
import wc from "../assets/Images/wcircle.svg";
import ba from "../assets/Images/barrow.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string()/* .email("Incorrect email") */,
  password:
    z.string() /* .min(8, "Password doesn’t meet requirement").regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[@$!%*?&]/, "Password must contain at least one special character (e.g., @, $, !, %, *, ?, &)"), */,
});

export default function Login() {
  const [isFocused, setIsFocused] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const [hidden, setHidden] = useState(true);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("isAdmin", false);
  }, []);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    setLoading(true); // Show spinner
    axios
      .post("https://server-zsg5.onrender.com/auth/login", data)
      .then((result) => {
        if (result.data.message === "Success") {
          if (result.data.isAdmin) {
            localStorage.setItem("isAdmin", true);
            toast(
              <div className="h-[84px] px-4 w-[280px] mx-auto text-[#00A86B] text-center bg-[#DDDDDD] border-2 border-dashed border-[#00A86B] flex flex-col rounded-[32px] justify-center items-center">
                Login successfully. Redirecting...
              </div>,
              {
                position: "top-center",
                duration: 2000,
              }
            );
            setTimeout(() => navigate("/data"), 2000);
          } else {
            localStorage.setItem("isUser", true);
            localStorage.setItem("email", data.email);
            toast(
              <div className="h-[84px] px-4 w-[280px] mx-auto text-[#00A86B] text-center bg-[#DDDDDD] border-2 border-dashed border-[#00A86B] flex flex-col rounded-[32px] justify-center items-center">
                Login successfully. Redirecting...
              </div>,
              {
                position: "top-center",
                duration: 2000,
              }
            );
            setTimeout(() => navigate("/view"), 2000);
          }
        } else {
          alert("login failed: User Does not exist");
        }
      })
      .catch((err) => {
        // Extract and display error message
        const errorMessage = err.response?.data?.error || "An unexpected error occurred";
        toast(
          <div className="h-[84px] px-4 w-[280px]] mx-auto text-[#E2063A] text-center bg-[#DDDDDD] border-2 border-dashed border-[#E2063A]  flex flex-col rounded-[32px] justify-center items-center]">
            {errorMessage}
          </div>,
          { position: "top-center", duration: 2000 }
        );
      })
      .finally(() => {
        setLoading(false); // Hide spinner
      });
  };
  const email = watch("email"); // watch input value
  const password = watch("password"); // watch input value

  useEffect(() => {
    setIsFocused2(email && email.trim().length > 0);
  }, [email]);

  useEffect(() => {
    setIsFocused(password && password.trim().length > 0);
  }, [password]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        toast(
          <div className="h-[84px] px-4 w-[280px] mx-auto text-[#E2063A] text-center bg-[#DDDDDD] border-2 border-dashed border-[#E2063A]  flex flex-col rounded-[32px] justify-center items-center]">
            {error.message}
          </div>,
          {
            
            classNames: {
              cancelButton: "bg-orange-400",
            },
            duration: 2000,
            style: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto", // Center horizontally
            },
          }
        );
      });
    }
  }, [errors]);

  return (
    <div className="mt-[96px] py-32 px-4 flex flex-col content-center items-center">
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-70 flex justify-center items-center z-50">
          <div className=" relative w-24 h-24 border-[10px] border-black border-opacity-30  rounded-full animate-spin-slow flex justify-center items-center">
            <div className=" absolute w-24 h-24 border-[10px] border-[#E2063A] border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      <div className="max-w-[482px]">
        <p className="text-center mb-2 text-[#9A9A9A] bg-[#ffffff02] font-poopins font-medium text-[16px] leading-[26px] lg:font-nexa-bold lg:text-[36px] lg:leading-[48px] lg:mb-4">
          Login
        </p>
        <h3 className="text-center font-nexa-bold text-[36px] mb-2 leading-[48px] whitespace-nowrap lg:text-[56px] lg:leading-[78px] lg:mb-6">
          Get right back to <span className="text-[#E2063A]">it</span>
        </h3>
        <p className="text-center mt-2 font-poopins text-[14px] leading-[22px] lg:text-[20px] lg:leading-[32px]">
          Glad to have you working with us
        </p>
        <Toaster
          
          visibleToasts={1}
          toastOptions={{
            unstyled: true,
            className: "class",
          }}
        />
        <form className="mt-10 lg:mt-14" onSubmit={handleSubmit(onSubmit)}>
          {/* register your input into the hook by invoking the "register" function */}
          <input
            name="email"
            className={`w-full h-12 border-2 border-[#DDDDDD] rounded-full active:border-none focus:outline-none pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px] ${
              isFocused2
                ? "bg-black text-white placeholder:text-white border-black border-2"
                : ""
            }`}
            {...register("email")}
            placeholder="Email Address"
            type="string"
            id="email"
          />
          {/* include validation with required or other standard HTML validation rules */}
          <div
            className={`flex items-center content-center h-12 border-2 border-[#DDDDDD] rounded-full mt-4 pl-6 pr-2 font-poopins text-[14px] leading-[22px] lg:h-[72px] lg:text-[16px] lg:leading-[26px] ${
              isFocused ? "bg-black text-white border-black border-2" : ""
            }`}
          >
            <input
              name="password"
              className={`w-full email h-full active:border-none focus:outline-none ${
                isFocused ? "bg-black text-white placeholder:text-white" : ""
              }`}
              {...register("password")}
              placeholder="Password"
              type={hidden ? "password" : "text"}
            />
            {hidden ? (
              <img
                className="w-12"
                onClick={() => setHidden(!hidden)}
                src={isFocused ? hpas2 : hpas}
                alt=""
              />
            ) : (
              <img
                className="w-12"
                onClick={() => setHidden(!hidden)}
                src={isFocused ? hpas4 : hpas3}
                alt=""
              />
            )}
          </div>
          <p className="font-poopins text-[14px] leading-[18px] pl-2 pt-0.5 text-[#9A9A9A]">
            8 characters including a letter and a number
          </p>

          {/* errors will return when field validation fails  */}
          {/* {errors.password && toast.error('Event has not been created')} */}
          {/* <input className="mt-4 h-12 bg"   disabled={password?.trim()?.length === 0 && email?.trim()?.length === 0}/> */}

          <button
            type="submit"
            className="bg-[#E2063A] mt-4 text-white  rounded-full relative overflow-hidden group lg:h-[72px] lg:w-full  w-[100%]"
            disabled={
              password?.trim()?.length === 0 || email?.trim()?.length === 0
            }
          >
            <div
              className={`${
                password?.trim()?.length === 0 || email?.trim()?.length === 0
                  ? "inset-0 bg-[#ffffffd0] z-10 absolute w-100%"
                  : ""
              } relative  px-4 py-[13px] lg:py-[23px] lg:px-0  `}
            >
              <span className="relative z-10 ">
                <p className="font-nexa-bold text-[14px] leading-[22px] text-left lg:text-[16px] lg:leading-[26px] lg:pl-[40px]">
                  Login
                </p>
              </span>
              <div className="absolute right-[10px] top-[50%] translate-y-[-50%] lg:right-[25px]">
                <img
                  src={wc}
                  className={`${
                    password?.trim()?.length === 0 ||
                    email?.trim()?.length === 0
                      ? "hi"
                      : "hidden"
                  } lg:h-10`}
                />
                <img
                  src={ba}
                  className={`${
                    password?.trim()?.length === 0 ||
                    email?.trim()?.length === 0
                      ? "hidden"
                      : "block"
                  } lg:h-10`}
                />

                
              </div>
            </div>
          </button>
        </form>
      </div>
      <p className="mt-10">
        Don't have an account ?{" "}
        <button
          className="underline text-blue-500"
          onClick={() => {
            navigate("/Signup");
          }}
        >
          Sign up
        </button>
      </p>
    </div>
  );
}
