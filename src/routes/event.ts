import { Router } from 'express';
import * as eventCtrl from '../controllers/event';

const routes = Router();

routes.get('/', eventCtrl.getAll);
routes.get('/:id', eventCtrl.get);
routes.post('/', eventCtrl.store);
routes.put('/:id', eventCtrl.update);
routes.delete('/:id', eventCtrl.destroy);

// routes.post('/send', eventCtrl.send);

export default routes;
