<?php

namespace CivPlanet\Bundle\Repository;

use Doctrine\ORM\EntityRepository;

class EventRepository extends EntityRepository
{
    public function findAllOrderedByTimestamp()
    {
        return $this->getEntityManager()
            ->createQuery(
                'SELECT e FROM CPBundle:Event e
                ORDER BY e.timestamp DESC'
            )
            ->getResult();
    }

    public function findEvents()
    {
        return $this->getEntityManager()
            ->createQuery(
                'SELECT e FROM CPBundle:Event e, CPBundle:Player p, CPBundle:EventType et
                WHERE e.player = p.id AND e.eventType = et.id
                ORDER BY e.timestamp DESC'
            )
            ->getResult();
    }

    public function findEventsByParams($params)
    {
        $qb = $this->getEntityManager()->createQueryBuilder();

        $query = $qb->select('e')
            ->from('CPBundle:Event', 'e')
            ->innerJoin('e.player', 'p')
            ->innerJoin('e.eventType', 'et')
            ->orderBy('e.timestamp', 'DESC');

        if (isset($params['username'])) {
            $qb->andWhere('p.username = :username')
                ->setParameter('username', $params['username']);
        }

        if (isset($params['type'])) {
            $qb->andWhere('et.name = :eventType')
                ->setParameter('eventType', $params['type']);
        }

        if (isset($params['from'])) {
            $qb->andWhere('e.timestamp >= :from')
                ->setParameter('from', $params['from']);
        }

        if (isset($params['to'])) {
            $qb->andWhere('e.timestamp <= :to')
                ->setParameter('to', $params['to']);
        }

        return $query->getQuery()->getResult();
    }
}