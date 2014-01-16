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

    public function findOnlineOrderedByTimestamp()
    {
        return $this->getEntityManager()
            ->createQuery(
                'SELECT p FROM CPBundle:Player p, CPBundle:Session s
                 WHERE s.logoutEvent IS NULL and s.player = p.id
                 ORDER BY s.timestamp DESC'
            )
            ->getResult();
    }

}