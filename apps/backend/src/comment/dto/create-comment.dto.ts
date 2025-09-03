export class CreateCommentDto {
  post: string;
  user: string;
  parent?: string | null;
  content: string;
}
