"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import React from "react";
import Script from "next/script";
// import { useAuth } from "@clerk/nextjs";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

export const CourseEnrollButton = ({
  price,
  courseId,
}: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      alert('hey1!');
      // const userId=1;
      // const {userId}=useAuth();
      alert('hey2!');
      const response = await axios.post(`/api/courses/${courseId}/checkout`)
      const {userId} = response.data;
      //Initalize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(price * 100),
        currency: "INR",
        name: "Vidya",
        description: `Course Purchase - ${courseId} by User - ${userId}`,
        order_id: response.data.orderId,
        handler: async function (response: any) {
          console.log("Payment successful", response);
          console.log(`userId-------------->${userId}`);
          const r=await axios.get(`/api/courses/${courseId}/purchased/${userId}`);
          if(r.data.status)
          {
            console.log('purchased registered in DB succesfully!');
            toast.success('course purchase successful!');
          }
          else
          {
            console.log('purchased registered in DB unsuccesful!');
            toast.error('course purchase unsuccessful!');
          }
          //Handle successful Payement
        },
        prefill: {
          name: "John Doe",
          email: "johndoe@example.com",
          contact: "999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzpl = new window.Razorpay(options);
      rzpl.open();
    } catch(error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size="sm"
      className="w-full md:w-auto"
    >
      <Script src="https://checkout.razorpay.com/v1/checkout.js"/>
      Enroll for {formatPrice(price)}
    </Button>
  )
}