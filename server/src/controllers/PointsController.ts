import knex from '../database/connection'
import {Request, Response} from 'express';

class PointsController {
    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        /** 
         * Transaction was used because the last query depends on the first 
         * If the last query fails, the first won't be executed
         */
        const trx = await knex.transaction();
        
        const point = {
            image: 'image-fake',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };

        const insertedIds = await trx('points').insert(point);
    
        const point_id = insertedIds[0];
    
        const pointItems = items.map((item_id: number) => (
            {
                item_id,
                point_id
            }
        ));
    
        await trx('point_items').insert(pointItems);
    
        return response.json({
            id: point_id,
            ...point,
        });
    }
}

export default PointsController;