import { APIRoutes } from '../handles';
import http, {
    handleHttpError,
    handleHttpResponse,
} from '../utils/httpHandlers';
import { path } from '../../routing/routes';

export type ClientResponseType = {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    aboutMe: string;
    photoUrl: string;
};

export type CommentResponseType = {
    userId: string;
    commentText: string;
};

export const GetTrainerClients = () => {
    return http
        .get<ClientResponseType[]>(APIRoutes.Trainer.Clients.Clients)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const GetTrainerClientComment = (userId: string) => {
    const url = path(APIRoutes.Trainer.Comments.Comment, { userId });
    return http
        .get<CommentResponseType>(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const EditTrainerCientComment = (userId: string, newComment: string) => {
    const url = path(APIRoutes.Trainer.Comments.Comment, { userId });
    return http
        .post<CommentResponseType>(url, { userId, commentText: newComment })
        .then(handleHttpResponse)
        .catch(handleHttpError);
};

export const GetClient = (clientId: string) => {
    const url = path(APIRoutes.Trainer.Clients.Client, { userId: clientId });
    return http
        .get<ClientResponseType>(url)
        .then(handleHttpResponse)
        .catch(handleHttpError);
};
