package pe.com.cd.service;

import pe.com.cd.domain.Rol;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing Rol.
 */
public interface RolService {

    /**
     * Save a rol.
     *
     * @param rol the entity to save
     * @return the persisted entity
     */
    Rol save(Rol rol);

    /**
     * Get all the rols.
     *
     * @return the list of entities
     */
    List<Rol> findAll();


    /**
     * Get the "id" rol.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Optional<Rol> findOne(Long id);

    /**
     * Delete the "id" rol.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Search for the rol corresponding to the query.
     *
     * @param query the query of the search
     * 
     * @return the list of entities
     */
    List<Rol> search(String query);
}
