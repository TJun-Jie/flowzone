import { useMutation } from "convex/react";
import { UploadButton, UploadFileResponse } from "@xixixao/uploadstuff/react";
import "@xixixao/uploadstuff/react/styles.css";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function UploadButtonForActionItem({ id }: { id: Id<"actionItems"> }) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveStorageId = useMutation(api.files.saveStorageIds);
  const saveAfterUpload = async (uploaded: UploadFileResponse[]) => {
    await saveStorageId({
      actionItemId: id,
      storageIds: uploaded.map(({ response }) => ({
        storageId: (response as any).storageId,
      })),
    });
  };

  return (
    <UploadButton
      uploadUrl={generateUploadUrl}
      fileTypes={[".pdf", "image/*"]}
      multiple
      onUploadComplete={saveAfterUpload}
      onUploadError={(error: unknown) => {
        // Do something with the error.
        alert(`ERROR! ${error}`);
      }}
    />
  );
}
