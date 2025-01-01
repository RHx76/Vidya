import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req:Request,{params}:{params:{courseId:string,userId:string}}) {
    const newparams=await params;
    const {courseId,userId}=newparams;
    
    if (!userId || !courseId) {
        console.log(`userId and courseId are required!`);
        console.log(`userId ${userId}`);
        console.log(`courseId ${courseId}`);
        return NextResponse.json({message:"userId and courseId are required!"},{status:500});
      }

    try
    {
        const purchase = await prisma.purchase.create({
            data:{
                courseId,
                userId,
            }
        })

        return NextResponse.json({status:true},{status:200});
    }
    catch(error)
    {
        console.log(error);
        return NextResponse.json({status:true},{status:500});
    }
}