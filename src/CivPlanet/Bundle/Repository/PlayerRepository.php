<?php

namespace CivPlanet\Bundle\Repository;

use Doctrine\ORM\EntityRepository;

class PlayerRepository extends EntityRepository
{
    public function findAllOrderedByTimestamp()
    {
        return $this->getEntityManager()
            ->createQuery(
                'SELECT p FROM CPBundle:Player p ORDER BY p.timestamp DESC'
            )
            ->getResult();
    }
}