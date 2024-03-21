import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@fastgpt/service/common/response';
import { connectToDatabase } from '@/service/mongo';
import { authCert } from '@fastgpt/service/support/permission/auth/common';
import { MongoUsage } from '@fastgpt/service/support/wallet/usage/schema';
import { connectionMongo } from '@fastgpt/service/common/mongo';
import { checkFiles } from '../timerTask/dataset/checkInValidDatasetFiles';
import { addHours } from 'date-fns';
import { checkInvalid as checkInvalidImg } from '../timerTask/dataset/checkInvalidDatasetImage';
import { checkInvalidCollection } from '../timerTask/dataset/checkInvalidMongoCollection';
import { checkInvalidVector } from '../timerTask/dataset/checkInvalidVector';
import { MongoPlugin } from '@fastgpt/service/core/plugin/schema';
import { PluginTypeEnum } from '@fastgpt/global/core/plugin/constants';

/* pg 中的数据搬到 mongo dataset.datas 中，并做映射 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    await authCert({ req, authRoot: true });

    await MongoPlugin.updateMany(
      { type: { $exists: false } },
      {
        $set: {
          type: PluginTypeEnum.custom
        }
      }
    );
    await MongoPlugin.updateMany(
      { parentId: { $exists: false } },
      {
        $set: {
          parentId: null
        }
      }
    );

    jsonRes(res, {
      message: 'success'
    });
  } catch (error) {
    console.log(error);

    jsonRes(res, {
      code: 500,
      error
    });
  }
}
