import { IsUUID, IsIn, IsOptional, IsString } from "class-validator";

export class SendMessageDto {
  @IsUUID() roomId: string;
  @IsIn(["TEXT", "FILE"]) type: "TEXT" | "FILE";
  @IsOptional() @IsString() text?: string; // TEXT
  @IsOptional() fileMeta?: {
    // FILE
    url: string;
    name: string;
    size: number;
    mime: string;
  };
}
