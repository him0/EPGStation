import * as apid from '../../../../api';

export default interface ILiveThumbnailModel {
    getThumbnail(channelId: apid.ChannelId): Promise<Buffer | null>;
}
