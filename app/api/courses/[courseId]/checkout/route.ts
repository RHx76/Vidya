import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import razorpay from "@/lib/razorpay";

async function POST(req:Request,
    { params }: { params: { courseId: string;} }) {
    console.log("bella ciao!");
    const newparams = await params;
    try{
        console.log('hey');
        const user=await currentUser();
        console.log('hey2');
        if(!user || !user.id || !user.emailAddresses?.[0]?.emailAddress){
            return new NextResponse("Unauthorized",{status:401});
        }
        
        console.log(`id------------>${newparams.courseId}`);

        const course=await db.course.findUnique({
            where:{
                id:newparams.courseId,
                isPublished:true
            }
        });

        const purchase = await db.purchase.findUnique({
            where:{
                userId_courseId:{
                    userId:user.id,
                    courseId:newparams.courseId,
                }
            }
        });

        if(purchase)
            return new NextResponse("Already Purchased!",{status:400});

        if(!course)
            return new NextResponse("Not found",{status:404});

        try {
            const order = await razorpay.orders.create({
                amount: course.price! * 100,
                currency: "INR",
                receipt: "receipt_" + Math.random().toString(36).substring(7),
            });
            return NextResponse.json({orderId:order.id,userId:user.id},{status:200});
        }
        catch(error)
        {
            console.error("Error creating order:",error);
            return NextResponse.json({error:"Error creating order"},{status:500});
        }
    }
    catch(error){
        console.error("[COURSE_ID_CHECKOUT]",error);
        return new NextResponse("Internal Error",{status:500})
    }
}

export {POST};