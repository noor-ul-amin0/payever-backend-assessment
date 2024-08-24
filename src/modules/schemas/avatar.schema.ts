import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AvatarDocument = HydratedDocument<Avatar>;

@Schema()
export class Avatar {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  avatarHash: string;

  @Prop({ required: true })
  filePath: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
