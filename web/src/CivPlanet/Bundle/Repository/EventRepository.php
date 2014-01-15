<?php

namespace CivPlanet\Bundle\Repository;

use Doctrine\ORM\EntityRepository;

class EventRepository extends EntityRepository
{
    public function findAllOrderedByTimestamp()
    {
        return $this->getEntityManager()
            ->createQuery(
                'SELECT e FROM CPBundle:Event e ORDER BY e.timestamp DESC'
            )
            ->getResult();
    }
}