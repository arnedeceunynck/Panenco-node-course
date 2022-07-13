import { Exclude, Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

// search.query.ts
@Exclude()
export class SearchQuery {
  @Expose()
  @IsString()
  @IsOptional()
  public search?: string;
}