<?php

namespace CivPlanet\Bundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\ExclusionPolicy;
use JMS\Serializer\Annotation\Expose;
use JMS\Serializer\Annotation\Groups;
use JMS\Serializer\Annotation\VirtualProperty;
use JMS\Serializer\Annotation\SerializedName;

/**
 * @ORM\Entity
 * @ORM\Table(name="event")
 *
 * @ExclusionPolicy("all")
 */
class Event
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     *
     * @Expose
     * @SerializedName("eventId")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="Player", inversedBy="events", cascade="persist")
     * @ORM\JoinColumn(name="player_id", referencedColumnName="id")
     *
     */
    private $player;

    /**
     * @ORM\ManyToOne(targetEntity="EventType", inversedBy="events", cascade="persist")
     * @ORM\JoinColumn(name="event_type_id", referencedColumnName="id")
     *
     */
    private $eventType;

    /**
     * @ORM\Column(type="datetime")
     *
     * @Expose
     */
    private $timestamp;

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set timestamp
     *
     * @param \DateTime $timestamp
     * @return Event
     */
    public function setTimestamp($timestamp)
    {
        $this->timestamp = $timestamp;
    
        return $this;
    }

    /**
     * Get timestamp
     *
     * @return \DateTime 
     */
    public function getTimestamp()
    {
        return $this->timestamp;
    }

    /**
     * Set player
     *
     * @param \CivPlanet\Bundle\Entity\Player $player
     * @return Event
     */
    public function setPlayer(\CivPlanet\Bundle\Entity\Player $player = null)
    {
        $this->player = $player;
    
        return $this;
    }

    /**
     * Get player
     *
     * @return \CivPlanet\Bundle\Entity\Player 
     */
    public function getPlayer()
    {
        return $this->player;
    }

    /**
     * Set eventType
     *
     * @param \CivPlanet\Bundle\Entity\EventType $eventType
     * @return Event
     */
    public function setEventType(\CivPlanet\Bundle\Entity\EventType $eventType = null)
    {
        $this->eventType = $eventType;

        return $this;
    }

    /**
     * Get eventType
     *
     * @return \CivPlanet\Bundle\Entity\EventType
     */
    public function getEventType()
    {
        return $this->eventType;
    }

    /**
     * Get username
     *
     * @VirtualProperty
     * @SerializedName("player")
     */
    public function getAPIPlayer()
    {
        return array("username" => $this->player->getUsername());
    }

    /**
     * Get eventType
     *
     * @VirtualProperty
     * @SerializedName("type")
     */
    public function getAPIEventType()
    {
        return $this->eventType->getName();
    }
}