import { UploadDropzone } from "@/lib/uploadThing";
import toast from "react-hot-toast";
import { ourFileRouter } from "@/app/api/uploadThing/core";

interface FileUploadProps{
    onChange:(url?:String)=>void;
    endpoint:keyof typeof ourFileRouter;
};

export const FileUpload =({
    onChange,
    endpoint
}:FileUploadProps)=>{
    return (
        <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res)=>{
            onChange(res?.[0].url);
        }}
        onUploadError={(error:Error)=>{
            toast.error(`${error?.message}`);
        }}
        />
    )
}