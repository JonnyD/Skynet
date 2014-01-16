<?php

namespace CivPlanet\Bundle\Repository;

use Doctrine\ORM\EntityRepository;

class SessionRepository extends EntityRepository
{
    public function findAllOrderedByTimestamp()
    {
        return $this->getEntityManager()
            ->createQuery(
                'SELECT s FROM CPBundle:Session s ORDER BY s.timestamp DESC'
            )
            ->getResult();
    }

    public function findOnlineOrderedByTimestamp()
    {
        return $this->getEntityManager()
            ->createQuery(
                'SELECT s FROM CPBundle:Session s WHERE s.logoutEvent IS NULL ORDER BY s.timestamp DESC'
            )
            ->getResult();
    }
}