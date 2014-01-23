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

    public function findAllByUsername($username)
    {
        return $this->getEntityManager()
            ->createQuery(
                'SELECT e FROM CPBundle:Event e, CPBundle:Player p
                WHERE e.player = p.id AND p.username = :username
                ORDER BY e.timestamp DESC'
            )
            ->setParameter("username", $username)
            ->getResult();
    }
}