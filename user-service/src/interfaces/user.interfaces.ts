import { user_profiles } from '@prisma/client';

export type IUpdateProfileData = Partial<Pick<
    user_profiles,
    | 'first_name'
    | 'last_name'
    | 'first_name_kana'
    | 'last_name_kana'
    | 'birth_date'
    | 'gender'
    | 'nationality'
    | 'phone'
    | 'address'
    | 'profile_image_url'
    | 'languages'
>>;

declare module 'fastify' {
    interface FastifyRequest {
        user: {
            userId: string;
        };
    }
}
