<?php

namespace CivPlanet\Bundle\Repository;

use Doctrine\ORM\EntityRepository;

class SessionRepository extends EntityRepository
{
    public function findSessions()
    {
        return $this->getEntityManager()
            ->createQuery(
                'SELECT s FROM CPBundle:Session s
                ORDER BY s.loginTimestamp DESC'
            )
            ->getResult();
    }

    public function findSessionsByParams($params)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();

        $query = $qb->select('s')
            ->from('CPBundle:Session', 's')
            ->innerJoin('s.player', 'p')
            ->orderBy('s.loginTimestamp', 'DESC');

        if (isset($params['username'])) {
            $qb->andWhere('p.username = :username')
                ->setParameter('username', $params['username']);
        }

        return $query->getQuery()->getResult();
    }
}