import { useContext, useEffect, useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { APIError, TokenResponse } from "@/lib/types";
import { BASE_URL } from "@/lib/utils";
import { motion } from "framer-motion";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  username: z
    .string()
    .min(5, { message: "Username must be at least 5 characters long" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

function Login() {
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }, [error]);

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errResponse: APIError = await response.json();
      setError(errResponse.error);
    } else {
      const tokenResp: TokenResponse = await response.json();
      login(tokenResp.token, tokenResp.userID, tokenResp.expiry);
      navigate("/dashboard");
    }
  }

  return (
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">LOGIN</h2>
        <motion.div
          key={error}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error ? (
            <p className="text-sm tracking-wider text-destructive">{error}</p>
          ) : (
            <p className="text-sm tracking-wider">
              Login to your account to access your links and shorten new ones.
            </p>
          )}
        </motion.div>
        <div className="p-4">
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onSubmit)}
              className="space-y-3"
            >
              <FormField
                control={loginForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-0 h-[81px]">
                    <FormLabel className="pb-1">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a username" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs pl-2 py-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-0 h-[81px]">
                    <FormLabel className="pb-1">Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a password" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs pl-2 py-1" />
                  </FormItem>
                )}
              />
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Button type="submit" variant={"default"}>
                    LOGIN
                  </Button>
                  <p className="text-xs text-center">
                    Don't have an account?{" "}
                    <button
                      className="text-[#00ADD8] hover:underline"
                      onClick={() => navigate("/signup")}
                      type="button"
                    >
                      Sign Up
                    </button>
                  </p>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
  );
}

export default Login;
