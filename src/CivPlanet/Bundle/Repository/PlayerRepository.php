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
                 ORDER BY s.loginTimestamp DESC'
            )
            ->getResult();
    }

    public function findOnlineAtTimestamp($timestamp)
    {
        return $this->getEntityManager()
            ->createQuery(
                'SELECT p FROM CPBundle:Player p, CPBundle:Session s
                 WHERE s.loginTimestamp <= :thetimestamp
                 AND s.logoutTimestamp >= :thetimestamp
                 AND s.player = p.id
                 ORDER BY s.logoutTimestamp DESC'
            )
            ->setParameter('thetimestamp', $timestamp)
            ->getResult();
    }

}